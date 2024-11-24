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
import { ref, inject, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
import { PlusIcon, DocumentPlusIcon } from '@heroicons/vue/24/outline'
import RewardsStats from '../components/RewardsStats.vue'
import DomainsList from '../components/DomainsList.vue'
import TransferModal from '../components/TransferModal.vue'

const walletStore = useWalletStore()
const { currentChainConfig, account } = storeToRefs(walletStore)
const loading = inject('loading')
const toast = inject('toast')

// 域名列表数据
const domains = ref([
  {
    name: 'test.nuls',
    time: '2024-10-01 21:56:10',
    isPrimary: true,
    rewardsActive: true,
    showActions: false
  },
  {
    name: 'test2.nuls',
    time: '2024-10-01 21:56:20',
    isPrimary: false,
    rewardsActive: false,
    showActions: false
  },
  {
    name: 'test3.nuls',
    time: '2024-10-23 18:41:40',
    isPrimary: false,
    rewardsActive: true,
    showActions: false
  }
])
const showTransferModal = ref(false)
const selectedDomain = ref(null)

// 奖励数据
const totalRewards = ref('0')
const totalRewardsUsd = ref('0')
const unclaimedRewards = ref('0')
const unclaimedRewardsUsd = ref('0')

onMounted(async () => {
  if (account.value) {
    await loadDomains()
    await loadRewards()
  }
})

// 加载域名列表
const loadDomains = async () => {
  try {
    loading.show('Loading domains...')
    const data = {
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "userDomains",
      methodDesc: "(Address user) return UserInfo",
      args: [account.value]
    }
    const result = await walletStore.invokeView(data)
    const list = [
  {
    name: 'test.nuls',
    time: '2024-10-01 21:56:10',
    isPrimary: true,
    rewardsActive: true,
    showActions: false
  },
  {
    name: 'test2.nuls',
    time: '2024-10-01 21:56:20',
    isPrimary: false,
    rewardsActive: false,
    showActions: false
  },
  {
    name: 'test3.nuls',
    time: '2024-10-23 18:41:40',
    isPrimary: false,
    rewardsActive: true,
    showActions: false
  }
]
    domains.value = list
    // domains.value = result.map(domain => ({
    //   ...domain,
    //   showActions: false
    // }))
  } catch (error) {
    console.error('Failed to load domains:', error)
    toast.show('Failed to load domains', 'error')
  } finally {
    loading.hide()
  }
}

// 加载奖励数据
const loadRewards = async () => {
  try {
    const data = {
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodDesc: "(Address user) return String",
      args: [account.value]
    }
    const [received, pending] = await Promise.all([
      walletStore.invokeView({...data, methodName: "getUserRewardReceived"}),
      walletStore.invokeView({...data, methodName: "pendingAward"})
    ])
    
    totalRewards.value = '1'
    unclaimedRewards.value =  '1'
    // TODO: Add USD conversion
    totalRewardsUsd.value = '0'
    unclaimedRewardsUsd.value = '0'
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
      methodDesc: "()",
    }
    await walletStore.contractCall(data)
    toast.show('Rewards claimed successfully', 'success')
    await loadRewards()
  } catch (error) {
    console.error('Failed to claim rewards:', error)
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
    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "transfer",
      methodDesc: "(String domain, Address to)",
      args: [domain.name, recipient]
    }
    await walletStore.contractCall(data)
    toast.show('Domain transferred successfully', 'success')
    await loadDomains()
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
      methodDesc: "(String domain)",
      args: [domain.name],
    }
    await walletStore.contractCall(data)
    toast.show('Primary identity updated', 'success')
    await loadDomains()
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
    await loadDomains()
  } catch (error) {
    console.error('Failed to toggle rewards:', error)
    toast.show('Failed to toggle rewards', 'error')
  } finally {
    loading.hide()
  }
}
</script>

<style scoped>
.my-domains {
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
  background: var(--primary);
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
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 228, 134, 0.2);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Empty State Styles */
.no-domains {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: rgba(0, 228, 134, 0.1);
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