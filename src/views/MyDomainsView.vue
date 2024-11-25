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
      <template v-if="domains.length">
        <RewardsStats
          :total-rewards="totalRewards"
          :total-rewards-usd="totalRewardsUsd"
          :unclaimed-rewards="unclaimedRewards"
          :unclaimed-rewards-usd="unclaimedRewardsUsd"
          @claim-rewards="claimAllRewards"
        />
        
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
import { ref, inject, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
import { PlusIcon, DocumentPlusIcon } from '@heroicons/vue/24/outline'
import RewardsStats from '../components/RewardsStats.vue'
import DomainsList from '../components/DomainsList.vue'
import TransferModal from '../components/TransferModal.vue'

const walletStore = useWalletStore()
const { currentChainConfig, account,nulsUsdPrice ,domains,totalRewards,totalRewardsUsd,unclaimedRewards,unclaimedRewardsUsd} = storeToRefs(walletStore)
const loading = inject('loading')
const toast = inject('toast')

// 域名列表数据
// const domains = ref([])
const showTransferModal = ref(false)
const selectedDomain = ref(null)

// 奖励数据
// const totalRewards = ref('0')
// const totalRewardsUsd = ref('0')
// const unclaimedRewards = ref('0')
// const unclaimedRewardsUsd = ref('0')

onMounted(async () => {
  if (account.value) {
    await walletStore.loadDomains()
    await walletStore.loadRewards()
  }
})

// 加载域名列表
// const loadDomains = async () => {
//   try {
//     loading.show('Loading domains...')
//     const data = {
//       contractAddress: currentChainConfig.value.contracts.domainAddress,
//       methodName: "userDomains",
//       methodDesc: "",
//       args: [account.value]
//     }
//     let result = await walletStore.invokeView(data)
//     result = JSON.parse(result.result)
//     console.log('result:',result)
//     const activeDomains = result.activeDomains.map(domain=>({
//       name:domain,
//       isPrimary:result.mainDomain === domain?true:false,
//       rewardsActive:true,
//       showActions: false
//     }))
//     const inactiveDomains = result.inactiveDomains.map(domain=>({
//       name:domain,
//       isPrimary:false,
//       rewardsActive:false,
//       showActions: false
//     }))
    
//     const list = [...activeDomains,...inactiveDomains] 

//     domains.value = list.map(domain => ({
//       ...domain,
//       showActions: false
//     }))
//   } catch (error) {
//     console.error('Failed to load domains:', error)
//     toast.show('Failed to load domains', 'error')
//   } finally {
//     loading.hide()
//   }
// }

// 加载奖励数据
const loadRewards = async () => {
  try {
    const data = {
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodDesc: "",
      args: [account.value]
    }
    const [received, pending] = await Promise.all([
      walletStore.invokeView({...data, methodName: "getUserRewardReceived"}),
      walletStore.invokeView({...data, methodName: "pendingAward"})
    ])
    
    totalRewards.value = received.result
    unclaimedRewards.value =  pending.result
    // TODO: Add USD conversion
    totalRewardsUsd.value = (received.result * nulsUsdPrice.value).toString()
    unclaimedRewardsUsd.value = (pending.result * nulsUsdPrice.value).toString()
  } catch (error) {
    console.error('Failed to load rewards:', error)
  }
}

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
      if(!userAddress.result) {
        toast.show('The domain name does not exist', 'error')
        return;
      }
      recipientAddress = userAddress.result;
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
      args: [domain.name],
    }
    await walletStore.contractCall(data)
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
    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "activeAward",
      methodDesc: "(String domain)",
      args: [domain.name],
    }
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