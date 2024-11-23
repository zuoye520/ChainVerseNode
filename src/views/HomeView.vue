<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="hero">
      <div class="hero-background">
        <div class="circuit-pattern"></div>
        <div class="glow-effect"></div>
      </div>

      <div class="hero-content">
        <h1 class="glitch-text">
          <span class="main-text">NULS AI Digital Identity</span>
          <span class="glitch">NULS AI Digital Identity</span>
          <span class="glitch">NULS AI Digital Identity</span>
        </h1>
        <p class="hero-description">The First AI Digital Identity Protocol with Passive Income</p>
        
        <div class="search-container">
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search for your digital identity"
              class="cyber-input"
              @keyup.enter="searchDomain"
            >
            <button @click="searchDomain" class="cyber-button">
              <div class="button-content">
                <MagnifyingGlassIcon class="search-icon" />
                <span>Search</span>
              </div>
              <div class="button-glitch"></div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <Features />

    <!-- Search Results Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Available identities</h2>
        <button class="close-btn" @click="closeModal">
          <XMarkIcon class="close-icon" />
        </button>
      </div>
      <div class="domain-list">
        <div v-for="domain in searchResults" :key="domain.name" class="domain-item">
          <div class="domain-info">
            <h3>{{ domain.name }}</h3>
            <div class="domain-meta">
              <p class="domain-price">{{ $format.fromAmount(domain.price) }}</p>
              <span v-if="domain.registered" class="status-tag registered">
                Already registered
              </span>
              <span v-else class="status-tag available">
                Registerable
              </span>
            </div>
          </div>
          <button 
            class="cyber-button small"
            :disabled="domain.registered"
            @click="registerDomain(domain)"
          >
            {{ domain.registered ? 'Already registered' : 'Register' }}
          </button>
        </div>
      </div>
    </div>
  </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, inject, getCurrentInstance, onMounted, onUnmounted, onBeforeMount, onUpdated } from 'vue'
import { useWalletStore } from '../stores/wallet'
const walletStore = useWalletStore()
// 获取全局配置
const { proxy } = getCurrentInstance()
const { CONFIG, CONSTANTS } = proxy.$config


import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Features from '../components/Features.vue'
// 使用 Loading

import '../styles/HomeView.css'
const loading = inject('loading');
const searchQuery = ref('')
const searchResults = ref([])
const showModal = ref(false)

onBeforeMount(() => {
  console.log('Component will be mounted')
  initializeData()
})

onMounted(() => {
  console.log('Component mounted')
  // success('操作成功！')
  // loading.show()
  window.addEventListener('resize', handleResize)
  setupCircuitAnimation()
})

onUpdated(() => {
  console.log('Component updated')
})

onUnmounted(() => {
  console.log('Component will be unmounted')
  window.removeEventListener('resize', handleResize)
})

const initializeData = () => {
  searchQuery.value = ''
  searchResults.value = []
  showModal.value = false
}

const handleResize = () => {
  console.log('Window resized')
}

const setupCircuitAnimation = () => {
  const pattern = document.querySelector('.circuit-pattern')
  if (pattern) {
    // Add animation logic
  }
}

const searchDomain = async() => {
  proxy.$toast.showToast('操作成功', 'success')
  return
  if (!searchQuery.value) return
  loading.show()
  const data = {
      contractAddress: "tNULSeBaN9B1GTocxwZhUpBjqdsrTeJNkksVZC",
      methodName: "getPriceByDomain",
      methodDesc: "(String domain) return String[]",
  }
  const searchList = [searchQuery.value+'.nuls',searchQuery.value+'1.nuls','my'+searchQuery.value+'.nuls'];
  const results = await Promise.all([
      walletStore.invokeView({...data,...{args: [searchList[0]]}}),
      walletStore.invokeView({...data,...{args: [searchList[1]]}}),
      walletStore.invokeView({...data,...{args: [searchList[2]]}})
    ]);
  const list = []
  results.forEach((item,index)=>{
    const result = JSON.parse(item.result)
    list.push({
      name:searchList[index],
      price:result[0],
      registered:!result[1]
    })
  })
  searchResults.value = list;
  loading.hide()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>