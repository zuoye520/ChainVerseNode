<template>
  <div class="my-domains">
    <div class="container">
      <div class="page-header">
        <h1>My Identity</h1>
        <router-link to="/" class="cyber-button">
          <PlusIcon class="btn-icon" />
          Register New Identity
        </router-link>
      </div>

      <!-- 有域名时显示 -->
        <RewardsStats
          :total-rewards="totalRewards"
          :total-rewards-usd="totalRewardsUsd"
          :unclaimed-rewards="unclaimedRewards"
          :unclaimed-rewards-usd="unclaimedRewardsUsd"
          @claim-rewards="claimAllRewards"
        />
      <template v-if="domains.length">  
        <DomainsList
          :domains="domains"
          @transfer="transferDomain"
          @set-primary="setPrimaryIdentity"
          @toggle-rewards="toggleRewards"
        />
      </template>

      <!-- 无域名时显示 -->
      <div v-else class="no-domains">
        <div class="empty-state-icon">
          <DocumentPlusIcon class="icon" />
        </div>
        <h2>No Digital Identity Found</h2>
        <p>You don't own any digital identity yet. Start by registering your first one!</p>
        <router-link to="/" class="cyber-button">
          <PlusIcon class="btn-icon" />
          Register Identity
        </router-link>
      </div>
    </div>

    <!-- Transfer Modal -->
    <TransferModal
      v-model:show="showTransferModal"
      :domain="selectedDomain"
      @transfer="handleTransfer"
    />
  </div>
</template>

<script setup>
import '../styles/MyDomainsView.css'
import { ref, inject,getCurrentInstance, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
import { PlusIcon, DocumentPlusIcon } from '@heroicons/vue/24/outline'
import RewardsStats from '../components/RewardsStats.vue'
import DomainsList from '../components/DomainsList.vue'
import TransferModal from '../components/TransferModal.vue'

const walletStore = useWalletStore()
const { currentChainConfig, account,accountPub,domains,totalRewards,totalRewardsUsd,unclaimedRewards,unclaimedRewardsUsd} = storeToRefs(walletStore)
const loading = inject('loading')
const toast = inject('toast')
// 获取全局配置
const { proxy } = getCurrentInstance()
const showTransferModal = ref(false)
const selectedDomain = ref(null)

onMounted(async () => {
  if (account.value) {
    await walletStore.loadDomains()
    await walletStore.loadRewards()
  }else{
    setTimeout(()=>{
      walletStore.loadDomains()
      walletStore.loadRewards()
    },3000)
  }
})

// 领取所有奖励
const claimAllRewards = async () => {
  try {
    loading.show('Claiming rewards...')
    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "receiveAward",
      methodDesc: "",
    }
    const result = await walletStore.contractCall(data)
    console.log('claimAllRewards result',result)
    toast.show('Rewards claimed successfully', 'success')
    await walletStore.loadRewards()
  } catch (error) {
    console.error('Failed to claim rewards:', JSON.stringify(error))
    toast.show('Failed to claim rewards', 'error')
  } finally {
    loading.hide()
  }
}

// 转移域名
const transferDomain = (domain) => {
  selectedDomain.value = domain
  showTransferModal.value = true
}

// 处理转移
const handleTransfer = async ({ domain, recipient }) => {
  try {
    loading.show('Transferring domain...')
    console.log('domain, recipient',{ domain, recipient })
    let recipientAddress = recipient;//接收者地址
    //获取域名ID
    const domainId = await walletStore.invokeView({
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "domainId",
      args: [domain.name]
    })
    console.log('tokenId:',domainId)
    const tokenId = domainId.result;

    //如果输入的域名则需要解析出来地址
    if(recipient.indexOf('.nuls') > -1){
      const userAddress = await walletStore.invokeView({
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodName: "userAddress",
        args: [recipient]
      })
      console.log('userAddress:',userAddress)
      if(!userAddress.result) {
        toast.show('The AI Identity does not exist', 'error')
        return;
      }
      const [domaainAddress] = JSON.parse(userAddress.result)
      recipientAddress = domaainAddress;
    }

    const from = account.value
    const data = {
      from: from,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.nrc721Address,
      methodName: "transferFrom",
      methodDesc: "(Address from, Address to, BigInteger tokenId) return void",
      args: [from,recipientAddress,tokenId]
    }
    await walletStore.contractCall(data)
    toast.show('Domain transferred successfully', 'success')
    await walletStore.loadDomains()
  } catch (error) {
    console.error('Transfer failed:', error)
    toast.show('Failed to transfer domain', 'error')
    throw error
  } finally {
    loading.hide()
  }
}

// 设置主域名
const setPrimaryIdentity = async (domain) => {
  try {
    loading.show('Setting primary identity...')
    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "changeMainDomain",
      methodDesc: "",
      args: [domain.name,accountPub.value],
    }
    const resSetPrimaryIdentity = await walletStore.contractCall(data)
    console.log('resSetPrimaryIdentity:',resSetPrimaryIdentity)
    toast.show('Primary identity updated', 'success')
    await walletStore.loadDomains()
  } catch (error) {
    console.error('Failed to set primary identity:', error)
    toast.show('Failed to set primary identity', 'error')
  } finally {
    loading.hide()
  }
}

// 切换奖励状态
const toggleRewards = async (domain) => {
  try {
    loading.show(domain.rewardsActive ? 'Deactivating rewards...' : 'Activating rewards...')
    //查询域名价格
    const {result:price} = await walletStore.invokeView({
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodName: "getPriceByDomain",
        args: [domain.name]
    })
    console.log('domain price:',price)
    const [domainPrice] = JSON.parse(price);
    const data = {
      from: account.value,
      value: proxy.$format.fromAmount(domainPrice),
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "activeAward",
      methodDesc: "",
      args: [domain.name,accountPub.value],
    }
    console.log('activeAward:',data)
    await walletStore.contractCall(data)
    toast.show(`Rewards ${domain.rewardsActive ? 'deactivated' : 'activated'} successfully`, 'success')
    await walletStore.loadDomains()
  } catch (error) {
    console.error('Failed to toggle rewards:', error)
    toast.show('Failed to toggle rewards', 'error')
  } finally {
    loading.hide()
  }
}
</script>