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
      <div class="lucky" v-show="airdropNum">🎉 You can register {{ airdropNum }} AI identities with more than 4 characters for free.</div>
      <div class="domain-list">
        <div v-for="domain in searchResults" :key="domain.name" class="domain-item">
          <div class="domain-info">
            <h3>{{ domain.name }}</h3>
            <div class="domain-meta">
              <p class="domain-price">{{ $format.fromAmount(domain.price) }} NULS</p>
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
import '../styles/HomeView.css'
import { ref, inject, getCurrentInstance, onMounted, onUnmounted, onBeforeMount, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
const walletStore = useWalletStore()
const { currentChainConfig, account,accountPub } = storeToRefs(walletStore)
// 获取全局配置
const { proxy } = getCurrentInstance()
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Features from '../components/Features.vue'
const loading = inject('loading');
const toast = inject('toast');
//Initialize data
const airdropNum = ref(0)
const searchQuery = ref('')
const searchResults = ref([])
const showModal = ref(false)
onBeforeMount(() => {
  console.log('Component will be mounted')
  initializeData()
})

onMounted(() => {
  console.log('Component mounted')
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
  airdropNum.value = 0
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
  // console.log('currentChainConfig:',currentChainConfig)
  if(!account.value){
    await walletStore.connect()
    return;
  }
  if (!searchQuery.value) {
    toast.show('Please enter your digital identity', 'warning')
    return;
  }
  loading.show()
  //查询空投次数
  const quota = await walletStore.invokeView({
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "userHistoryQuota",
      methodDesc: "",
      args: [account.value],
  })
  console.log('userHistoryQuota:',quota)
  airdropNum.value = quota.result*1


  const suffix = "."+proxy.$config.SUFFIX[0];//后缀
  const searchList = [searchQuery.value+suffix,'1'+searchQuery.value+suffix,'my'+searchQuery.value+suffix];

  const data = {
      contractAddress: currentChainConfig.value.toolContractAddress,
      methodName: "aggregateStrict",
      args:[
        [
          currentChainConfig.value.contracts.domainAddress,
          currentChainConfig.value.contracts.domainAddress,
          currentChainConfig.value.contracts.domainAddress,
          currentChainConfig.value.contracts.domainAddress,
          currentChainConfig.value.contracts.domainAddress,
          currentChainConfig.value.contracts.domainAddress,
        ],
        ['getPriceByDomain','getPriceByDomain','getPriceByDomain','domainId','domainId','domainId'],
        [...searchList,...searchList],
        false
      ],
  }
  let {result} = await walletStore.invokeView(data)
  result = JSON.parse(result)
  // console.log('results:',result)
  const list = []
  for (let index = 0; index < 3; index++) {
    const item = JSON.parse(result[index])
    list.push({
      name:searchList[index],
      price:item[0],
      registered:result[index+3] !== ""
    })
    
  }
  searchResults.value = list;
  loading.hide()
  showModal.value = true
}
const registerDomain = async(domain)=>{
  try {
    console.log('domain:',domain.name)
    const data = {
        from: account.value,
        value: proxy.$format.fromAmount(domain.price),
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodName: "mint",
        methodDesc: "",
        args: [domain.name,accountPub.value],
        multyAssetValues: []
    }
    const suffix = "."+proxy.$config.SUFFIX[0];//后缀
    const name = (domain.name.split(suffix))[0]
    //有空投次数就可以免费mint 且域名必须大于4位
    if(airdropNum.value >0 && name.length >4){
      data.value = 0
      data.methodName = "mintHistory"
    }
    console.log('data:',data)
    const result = await walletStore.contractCall(data) // 返回交易hash
    console.log('result:',result)
    showModal.value = false;
    toast.show('Transaction sent successfully', 'success')
    
  } catch (error) {
    console.error(error)
    // toast.show(JSON.stringify(error), 'warning')
  }
  

}
const closeModal = () => {
  showModal.value = false
}
</script>