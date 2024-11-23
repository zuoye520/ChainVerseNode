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
import { ref, onMounted, onUnmounted, onBeforeMount, onUpdated, computed } from 'vue'
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

onBeforeMount(() => {
  console.log('Component will be mounted')
  initializeData()
})

onMounted(() => {
  console.log('Component mounted')
  loadDomains()
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

const loadDomains = () => {
  // Load domain data
  console.log('Loading domain data')
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

const claimAllRewards = () => {
  console.log('Claiming all rewards')
}

const setPrimaryIdentity = (domain) => {
  domains.value.forEach(d => d.isPrimary = false)
  domain.isPrimary = true
  saveDomainSettings()
}

const toggleRewards = (domain) => {
  domain.rewardsActive = !domain.rewardsActive
  saveDomainSettings()
}

const transferDomain = (domain) => {
  console.log('Transferring domain', domain.name)
}

// Computed properties
const totalRewards = computed(() => {
  // Calculate total rewards
  return '865,316.0023'
})

const unclaimedRewards = computed(() => {
  // Calculate unclaimed rewards
  return '386,383.9192'
})
</script>