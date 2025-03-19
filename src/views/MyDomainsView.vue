<template>
  <div class="my-nodes">
    <div class="container">
      <div class="page-header">
        <h1>My Nodes</h1>
        <router-link to="/" class="cyber-button">
          <PlusIcon class="btn-icon" />
          Register New Node
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
        
        <!-- TDC Rewards Section -->
        <TdcRewardsStats
          :apr="apr"
          :available-balance="availableBalance"
          :staked-amount = "stakedAmount"
          :total-rewards="tdcTotalRewards"
          :total-rewards-usd="tdcTotalRewardsUsd"
          :unclaimed-rewards="tdcUnclaimedRewards"
          :unclaimed-rewards-usd="tdcUnclaimedRewardsUsd"
          @claim-rewards="claimAllTdcRewards"
          @stake="handleTdcStake"
          @unstake="handleTdcUnstake"
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
          <ServerIcon class="icon" />
        </div>
        <h2>No AI Nodes Found</h2>
        <p>You don't own any AI nodes yet. Start by registering your first one!</p>
        <router-link to="/" class="cyber-button">
          <PlusIcon class="btn-icon" />
          Register Node
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
import { ref, inject, getCurrentInstance, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
import { PlusIcon, ServerIcon } from '@heroicons/vue/24/outline'
import RewardsStats from '../components/RewardsStats.vue'
import TdcRewardsStats from '../components/TdcRewardsStats.vue'
import DomainsList from '../components/DomainsList.vue'
import TransferModal from '../components/TransferModal.vue'

const walletStore = useWalletStore()
const { currentChainConfig, account, accountPub, domains, totalRewards, totalRewardsUsd, unclaimedRewards, unclaimedRewardsUsd } = storeToRefs(walletStore)
const loading = inject('loading')
const toast = inject('toast')
// 获取全局配置
const { proxy } = getCurrentInstance()
const suffix = proxy.$config.SUFFIX;//后缀
const showTransferModal = ref(false)
const selectedDomain = ref(null)

// TDC available Balance
const availableBalance = ref('0')
const stakedAmount = ref('0')
const apr = ref('0')
// TDC Rewards data
const tdcTotalRewards = ref('1000')
const tdcTotalRewardsUsd = ref('$100.00')
const tdcUnclaimedRewards = ref('1000')
const tdcUnclaimedRewardsUsd = ref('$100.00')


onMounted(async () => {
  if (account.value) {
    await walletStore.loadDomains()
    await walletStore.loadRewards()
    // Here you would load TDC rewards data
    loadTdcRewards()
  } 
  setInterval(() => {
    if (account.value) {
      loadTdcRewards()  
    }
    }, 5000);
})

// Load TDC rewards data
const loadTdcRewards = async () => {
  try {
    // loading.show('Loading TDC rewards...')
    const data = {
      contractAddress: currentChainConfig.value.toolContractAddress,
      methodName: "aggregateStrict",
      args:[
        [
        currentChainConfig.value.contracts.stakeAddress,
        currentChainConfig.value.contracts.stakeAddress,
        currentChainConfig.value.tdcTokenAddress,
        ],
        ['getDepositInfo','pendingToken','balanceOf'],
        [account.value,account.value,account.value],
        false
      ],
    }
    const result = await walletStore.invokeView(data)
    //console.log('TDC stake info:', result)
    const [depositInfo,unclaimedRewards,balanceOf] = JSON.parse(result.result)
    if(!depositInfo) return;
    //console.log('depositInfo:',depositInfo)
    const {received,amount} = JSON.parse(depositInfo)
    // //console.log('received:',received)
    // Update TDC rewards state
    tdcTotalRewards.value = proxy.$format.fromAmount(unclaimedRewards*1+received*1) 
    tdcTotalRewardsUsd.value = '$100.00'
    tdcUnclaimedRewards.value = proxy.$format.fromAmount(unclaimedRewards)
    tdcUnclaimedRewardsUsd.value = '$100.00'
    availableBalance.value = proxy.$format.fromAmount(balanceOf) 
    stakedAmount.value = proxy.$format.fromAmount(amount) 
    apr.value = (100 * (8.5 * 6 * 60 * 24 * 365) / stakedAmount.value).toFixed(1)
  } catch (error) {
    console.error('Failed to load TDC rewards:', error)
    toast.show('Failed to load TDC rewards', 'error')
  } finally {
    // loading.hide()
  }
}

// 领取所有奖励
const claimAllRewards = async () => {
  try {
    loading.show('Claiming NULS rewards...')
    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "receiveAwards",
    }
    const result = await walletStore.contractCall(data)
    toast.show('NULS rewards claimed successfully', 'success')
    await walletStore.loadRewards()
  } catch (error) {
    console.error('Failed to claim rewards:', error)
    toast.show('Failed to claim NULS rewards', 'error')
  } finally {
    loading.hide()
  }
}

// 领取所有TDC奖励
const claimAllTdcRewards = async () => {
  try {
    loading.show('Claiming TDC rewards...')
    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.stakeAddress,
      methodName: "receiveAwards",
      args: [0]
      
    }
    await walletStore.contractCall(data)
    toast.show('TDC rewards claimed successfully', 'success')
    await loadTdcRewards()
  } catch (error) {
    console.error('Failed to claim TDC rewards:', error)
    toast.show('Failed to claim TDC rewards', 'error')
  } finally {
    loading.hide()
  }
}

// 处理 TDC 质押
const handleTdcStake = async (amount) => {
  try {
    loading.show('Staking TDC...')
    //查询授权额度
    const allowance = await walletStore.invokeView({
      contractAddress: currentChainConfig.value.tdcTokenAddress,
      methodName: "allowance",
      args:[account.value,currentChainConfig.value.contracts.stakeAddress],
    })
    //console.log('allowance:',allowance)
    if(allowance.result*1 <=0){
      //开始授权
      const approveValue = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").toString(10)
      await walletStore.contractCall({
        from: account.value,
        contractAddress: currentChainConfig.value.tdcTokenAddress,
        methodName: "approve",
        args: [currentChainConfig.value.contracts.stakeAddress,approveValue]
      })
    }
    //开始质押
    await walletStore.contractCall({
      from: account.value,
      contractAddress: currentChainConfig.value.contracts.stakeAddress,
      methodName: "deposit",
      args: [proxy.$format.toAmount(amount)]
    })
    toast.show('Successfully staked TDC', 'success')
    await loadTdcRewards()
  } catch (error) {
    console.error('Failed to stake TDC:', error)
    toast.show('Failed to stake TDC', 'error')
  } finally {
    loading.hide()
  }
}

// 处理 TDC 解除质押
const handleTdcUnstake = async (amount) => {
  try {
    loading.show('Unstaking TDC...')
    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.stakeAddress,
      methodName: "withdraw",
      args: [proxy.$format.toAmount(amount)]
    }
    await walletStore.contractCall(data)
    toast.show('Successfully unstaked TDC', 'success')
    // await loadTdcRewards()
  } catch (error) {
    console.error('Failed to unstake TDC:', error)
    toast.show('Failed to unstake TDC', 'error')
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
    loading.show('Transferring node...')
    let recipientAddress = recipient;//接收者地址
    //获取域名ID
    const domainId = await walletStore.invokeView({
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "domainId",
      args: [domain.name]
    })
    const tokenId = domainId.result;

    //如果输入的域名则需要解析出来地址
    const lastSuffix = (recipient.split(".")).pop()
    const findItem = suffix.find(item=>item == lastSuffix)
    if(lastSuffix && findItem){
      const userAddress = await walletStore.invokeView({
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodName: "userAddress",
        args: [recipient]
      })
      if(!userAddress.result) {
        toast.show('The AI Node does not exist', 'error')
        return;
      }
      const [domaainAddress] = JSON.parse(userAddress.result)
      recipientAddress = domaainAddress;
    }
    const domainSuffix = (domain.name.split('.')).pop();
    const from = account.value
    const data = {
      from: from,
      value: 0,
      contractAddress: currentChainConfig.value.nrc721Address[domainSuffix],
      methodName: "transferFrom",
      methodDesc: "(Address from, Address to, BigInteger tokenId) return void",
      args: [from,recipientAddress,tokenId]
    }
    await walletStore.contractCall(data)
    toast.show('Node transferred successfully', 'success')
    await walletStore.loadDomains()
  } catch (error) {
    console.error('Transfer failed:', error)
    toast.show('Failed to transfer node', 'error')
  } finally {
    loading.hide()
  }
}

// 设置主域名
const setPrimaryIdentity = async (domain) => {
  try {
    loading.show('Setting primary node...')
    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "changeMainDomain",
      methodDesc: "",
      args: [domain.name,accountPub.value],
    }
    await walletStore.contractCall(data)
    toast.show('Primary node updated', 'success')
    await walletStore.loadDomains()
  } catch (error) {
    console.error('Failed to set primary node:', error)
    toast.show('Failed to set primary node', 'error')
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
    const [domainPrice] = JSON.parse(price);
    const data = {
      from: account.value,
      value: proxy.$format.fromAmount(domainPrice),
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "activeAward",
      methodDesc: "",
      args: [domain.name,accountPub.value],
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

<style scoped>
.my-nodes {
  padding-top: 80px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: white;
  font-size: 2rem;
  margin: 0;
}

.cyber-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  font-size: 0.95rem;
}

.cyber-button:hover {
  box-shadow: 0 4px 12px rgba(0, 194, 255, 0.3);
  transform: translateY(-1px);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Empty State Styles */
.no-domains {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: rgba(0, 194, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.empty-state-icon::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent,
    var(--primary),
    transparent
  );
  animation: rotate 4s linear infinite;
}

.empty-state-icon .icon {
  width: 40px;
  height: 40px;
  color: var(--primary);
  position: relative;
  z-index: 1;
}

.no-domains h2 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.no-domains p {
  color: var(--text);
  margin-bottom: 2rem;
  font-size: 1.1rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .cyber-button {
    width: 100%;
    justify-content: center;
  }

  .no-domains {
    padding: 2rem 1rem;
  }
}
</style>