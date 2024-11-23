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

      <!-- Rewards Overview Section -->
      <div class="rewards-stats" v-if="domains.length">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Total Rewards</div>
            <div class="stat-value">865,316.0023 NULS</div>
            <div class="stat-usd">≈ $31.75</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">Unclaimed Rewards</div>
            <div class="stat-value">386,383.9192 NULS</div>
            <div class="stat-usd">≈ $16.29</div>
          </div>

          <div class="stat-item action">
            <button class="cyber-button claim-all" @click="claimAllRewards">
              <SparklesIcon class="btn-icon" />
              Claim All Rewards
            </button>
          </div>
        </div>
      </div>
      
      <div class="domains-grid" v-if="domains.length">
        <div v-for="domain in domains" :key="domain.name" class="domain-card">
          <div class="domain-header">
            <h3>{{ domain.name }}</h3>
            <span class="registration-date">{{ formatDate(domain.time) }}</span>
          </div>

          <div class="domain-actions">
            <button 
              class="cyber-button secondary"
              :class="{ 'active': domain.isPrimary }"
              @click="setPrimaryIdentity(domain)"
            >
              <StarIcon class="btn-icon" />
              <span class="btn-text">{{ domain.isPrimary ? 'Primary Identity' : 'Set as Primary' }}</span>
            </button>

            <button 
              class="cyber-button secondary"
              :class="{ 'active': domain.rewardsActive }"
              @click="toggleRewards(domain)"
            >
              <BoltIcon class="btn-icon" />
              <span class="btn-text">{{ domain.rewardsActive ? 'Rewards Active' : 'Activate Rewards' }}</span>
            </button>

            <button class="cyber-button secondary" @click="transferDomain(domain)">
              <ArrowRightIcon class="btn-icon" />
              <span class="btn-text">Transfer</span>
            </button>
          </div>
        </div>
      </div>

      <div class="no-domains" v-else>
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
  </div>
</template>

<script setup>
import { ref, inject,getCurrentInstance,onMounted, onUnmounted, onBeforeMount, onUpdated, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
const walletStore = useWalletStore()
const { currentChainConfig, account } = storeToRefs(walletStore)
// 获取全局配置
const { proxy } = getCurrentInstance()
const { CHAINS,CONFIG, CONSTANTS } = proxy.$config
const loading = inject('loading');
const toast = inject('toast');
import { 
  SparklesIcon, 
  ArrowRightIcon, 
  PlusIcon,
  DocumentPlusIcon,
  StarIcon,
  BoltIcon
} from '@heroicons/vue/24/outline'
import '../styles/MyDomainsView.css'

const domains = ref([
  {
    name: 'test.nuls',
    time: '2024-10-01 21:56:10',
    isPrimary: true,
    rewardsActive: true
  },
  {
    name: 'test2.nuls',
    time: '2024-10-01 21:56:20',
    isPrimary: false,
    rewardsActive: false
  },
  {
    name: 'test3.nuls',
    time: '2024-10-23 18:41:40',
    isPrimary: false,
    rewardsActive: true
  }
])

// Computed properties
const totalRewards = computed(() => {
  // Calculate total rewards
  return '865,316.0023'
})

const unclaimedRewards = computed(() => {
  // Calculate unclaimed rewards
  return '386,383.9192'
})

onBeforeMount(() => {
  console.log('Component will be mounted')
  initializeData()
})

onMounted(() => {
  console.log('Component mounted')
  loadDomains()
  loadRewards()
})

onUpdated(() => {
  console.log('Component updated')
})

onUnmounted(() => {
  console.log('Component will be unmounted')
  saveDomainSettings()
})

const initializeData = () => {
  // Initialize data
  const savedDomains = localStorage.getItem('userDomains')
  if (savedDomains) {
    domains.value = JSON.parse(savedDomains)
  }
}
/**
 * 获取Domain数据
 */
const loadDomains = async () => {
  // Load domain data
  console.log('Loading domain data')
  // loading.show()
  const data = {
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "userDomains",
      methodDesc: "(Address user) return UserInfo",
      args:[account.value]
  }
  console.log('data:',data)
  const result = await walletStore.invokeView(data)
  console.log('result:',result)
  // loading.hide()
}
/**
 * 获取Rewards数据
 */
const loadRewards = async ()=>{
  const data = {
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodDesc: "(Address user) return String",
      args:[account.value]
  }
  console.log('getUserRewardReceived params:',{...data,...{methodName:"getUserRewardReceived"}})
  console.log('pendingAward params:',{...data,...{methodName:"pendingAward"}})
  const results = await Promise.all([
      walletStore.invokeView({...data,...{methodName:"getUserRewardReceived"}}),
      walletStore.invokeView({...data,...{methodName:"pendingAward"}}),
    ]);
    console.log('result:',results)
}

const saveDomainSettings = () => {
  // Save domain settings
  localStorage.setItem('userDomains', JSON.stringify(domains.value))
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
/**
 * 领取奖励
 */
const claimAllRewards = async () => {
  console.log('Claiming all rewards')
  const data = {
        from: account.value,
        value:0,
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodName: "receiveAward",
        methodDesc: "()",
        
    }
    console.log('data:',data)
    const result = await walletStore.contractCall(data) // 返回交易hash
    console.log('claimAllRewards result', result)
}
/**
 * 设置主域名
 * @param domain 
 */
const setPrimaryIdentity = async (domain) => {
  console.log('setPrimaryIdentity',domain)
  domains.value.forEach(d => d.isPrimary = false)
  domain.isPrimary = true
  saveDomainSettings()
  const data = {
        from: account.value,
        value:0,
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodName: "changeMainDomain",
        methodDesc: "(String domain)",
        args: [domain.value.name],
    }
  console.log('setPrimaryIdentity params:',data)
  const result = await walletStore.contractCall(data) // 返回交易hash
  console.log('setPrimaryIdentity result', result)

}
/**
 * 激活权益
 * @param domain 
 */
const toggleRewards = async (domain) => {
  domain.rewardsActive = !domain.rewardsActive
  saveDomainSettings()

  const data = {
        from: account.value,
        value:0,
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodName: "activeAward",
        methodDesc: "(String domain)",
        args: [domain.value.name],
    }
  console.log('toggleRewards params:',data)
  const result = await walletStore.contractCall(data) // 返回交易hash
  console.log('toggleRewards result', result)
}
/**
 * 转账域名
 * @param domain 
 */
const transferDomain = (domain) => {
  console.log('Transferring domain', domain.name)
}


</script>