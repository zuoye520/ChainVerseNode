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
          <span class="main-text">ChainVerse</span>
          <span class="glitch">ChainVerse</span>
          <span class="glitch">ChainVerse</span>
        </h1>
        <p class="hero-description">A new beginning, a new direction! Join as a node, contribute computing power to AI, and earn rewards!</p>
        
        <div class="search-container">
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchQuery" 
              @input="validateDomain"
              placeholder="Enter the node name"
              class="cyber-input"
              @keyup.enter="searchDomain"
            >
            <button @click="searchDomain" class="cyber-button">
              <div class="button-content">
                <span>Register</span>
              </div>
              <div class="button-glitch"></div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Node Stats Section -->
    <NodeStats />

    <!-- Features Section -->
    <Features />

    <!-- Search Results Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Available AI Nodes</h2>
        <button class="close-btn" @click="closeModal">
          <XMarkIcon class="close-icon" />
        </button>
      </div>
      <div class="lucky" v-show="airdropNum">🎉 You can register {{ airdropNum }} AI nodes with more than 4 characters for free.</div>
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
import { ref, inject, getCurrentInstance, onMounted, onUnmounted, onBeforeMount, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
const walletStore = useWalletStore()
const { currentChainConfig, account,accountPub } = storeToRefs(walletStore)
// 获取全局配置
const { proxy } = getCurrentInstance()
import { XMarkIcon } from '@heroicons/vue/24/outline'
import Features from '../components/Features.vue'
import NodeStats from '../components/NodeStats.vue'
const loading = inject('loading');
const toast = inject('toast');
//Initialize data
const airdropNum = ref(0)
const searchQuery = ref('')
const searchResults = ref([])
const showModal = ref(false)
onBeforeMount(() => {
  //console.log('Component will be mounted')
  initializeData()
})

onMounted(() => {
  //console.log('Component mounted')
  window.addEventListener('resize', handleResize)
  setupCircuitAnimation()
})

onUpdated(() => {
  //console.log('Component updated')
})

onUnmounted(() => {
  //console.log('Component will be unmounted')
  window.removeEventListener('resize', handleResize)
})

const initializeData = () => {
  airdropNum.value = 0
  searchQuery.value = ''
  searchResults.value = []
  showModal.value = false
}

const handleResize = () => {
  //console.log('Window resized')
}

const setupCircuitAnimation = () => {
  const pattern = document.querySelector('.circuit-pattern')
  if (pattern) {
    // Add animation logic
  }
}


const validateDomain = (event) => {
  // 获取用户输入的值
  let value = event.target.value.toLowerCase(); // 更新输入框的值（自动转换为小写）
  // 替换掉不符合要求的字符（非小写字母和数字）
  value = value.replace(/[^a-z0-9]/g, '');
  searchQuery.value = value;
};


const searchDomain = async() => {
  
  //console.log('currentChainConfig:',currentChainConfig)
  try {
    
  
  if(!account.value){
    await walletStore.connect()
    return;
  }
  if (!searchQuery.value) {
    toast.show('Please enter your AI node name', 'warning')
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
  //console.log('userHistoryQuota:',quota)
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
  // //console.log('results:',result)
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
  } catch (error) {
    console.error('error:',error)
  } finally{
    // console.log('finally')
  }
}
const registerDomain = async(domain)=>{
  try {
    //console.log('domain:',domain.name)
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
    //console.log('data:',data)
    const result = await walletStore.contractCall(data) // 返回交易hash
    //console.log('result:',result)
    showModal.value = false;
    toast.show('Transaction sent successfully', 'success')
    
  } catch (error) {
    console.error(error)
    toast.show(error.message, 'error')
  }
  

}
const closeModal = () => {
  showModal.value = false
}
</script>

<style>
.home {
  min-height: 100vh;
  background: var(--bg-dark);
  overflow: hidden;
}

.hero {
  position: relative;
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.glitch-text {
  position: relative;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: white;
  text-shadow: 0 0 10px rgba(0, 194, 255, 0.5);
  margin-bottom: 1.5rem;
}

.glitch-text .main-text {
  display: block;
}

.glitch-text .glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  clip: rect(0, 900px, 0, 0);
  animation: glitch 2s infinite linear alternate-reverse;
}

.glitch-text .glitch:nth-child(2) {
  clip: rect(44px, 900px, 66px, 0);
  animation-delay: 2s;
  animation-duration: 3s;
}

.glitch-text .glitch:nth-child(3) {
  clip: rect(22px, 900px, 33px, 0);
  animation-delay: 4s;
  animation-duration: 4s;
}

@keyframes glitch {
  0% { clip: rect(44px, 900px, 56px, 0); transform: skew(.2deg); }
  5% { clip: rect(22px, 900px, 33px, 0); transform: skew(.1deg); }
  10% { clip: rect(55px, 900px, 66px, 0); transform: skew(.4deg); }
  15% { clip: rect(11px, 900px, 44px, 0); transform: skew(.3deg); }
  20% { clip: rect(33px, 900px, 77px, 0); transform: skew(.5deg); }
  25% { clip: rect(66px, 900px, 88px, 0); transform: skew(.2deg); }
  30% { clip: rect(44px, 900px, 55px, 0); transform: skew(.1deg); }
  35% { clip: rect(77px, 900px, 99px, 0); transform: skew(.4deg); }
  40% { clip: rect(11px, 900px, 22px, 0); transform: skew(.3deg); }
  45% { clip: rect(44px, 900px, 66px, 0); transform: skew(.5deg); }
  50% { clip: rect(22px, 900px, 33px, 0); transform: skew(.2deg); }
  55% { clip: rect(55px, 900px, 66px, 0); transform: skew(.1deg); }
  60% { clip: rect(11px, 900px, 44px, 0); transform: skew(.4deg); }
  65% { clip: rect(33px, 900px, 77px, 0); transform: skew(.3deg); }
  70% { clip: rect(66px, 900px, 88px, 0); transform: skew(.5deg); }
  75% { clip: rect(44px, 900px, 55px, 0); transform: skew(.2deg); }
  80% { clip: rect(77px, 900px, 99px, 0); transform: skew(.1deg); }
  85% { clip: rect(11px, 900px, 22px, 0); transform: skew(.4deg); }
  90% { clip: rect(44px, 900px, 66px, 0); transform: skew(.3deg); }
  95% { clip: rect(22px, 900px, 33px, 0); transform: skew(.5deg); }
  100% { clip: rect(55px, 900px, 66px, 0); transform: skew(.2deg); }
}

.hero-description {
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: var(--text);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.hero-background {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
}

.circuit-pattern {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: 
    linear-gradient(to right, rgba(0, 194, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 194, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  transform: perspective(500px) rotateX(60deg);
  animation: circuit 20s linear infinite;
}

@keyframes circuit {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
}

.glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(0, 194, 255, 0.2) 0%,
    transparent 70%
  );
  filter: blur(100px);
}

/* Search Container Styles */
.search-container {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.search-input-wrapper {
  display: flex;
  gap: 0.5rem;
  background: var(--card-bg);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.cyber-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.cyber-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(0, 194, 255, 0.2);
}

.cyber-button {
  position: relative;
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cyber-button:hover {
  box-shadow: 0 4px 12px rgba(0, 194, 255, 0.3);
  transform: translateY(-1px);
}

.button-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-glitch {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: glitch-animation 3s infinite;
}

@keyframes glitch-animation {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: currentColor;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(10, 14, 23, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  color: white;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s;
}

.close-btn:hover {
  color: white;
}

.close-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.domain-list {
  padding: 1.5rem;
}

.domain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 0.75rem;
}

.domain-info h3 {
  color: var(--primary);
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.domain-info p {
  color: var(--text);
}

.cyber-button.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .search-input-wrapper {
    flex-direction: column;
  }

  .cyber-button {
    width: 100%;
    justify-content: center;
  }

  .domain-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 2rem 1rem;
  }

  .glitch-text {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }
}

/* 在现有样式中添加 */
.domain-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.domain-price {
  color: var(--text);
  margin: 0;
}

.status-tag {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-tag.registered {
  background: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
  border: 1px solid rgba(255, 77, 77, 0.2);
}

.status-tag.available {
  background: rgba(0, 194, 255, 0.1);
  color: var(--primary);
  border: 1px solid rgba(0, 194, 255, 0.2);
}

.cyber-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.1);
  border-color: transparent;
}

.cyber-button:disabled:hover {
  transform: none;
  background: rgba(255, 255, 255, 0.1);
}
.lucky{
  padding: 0.5rem 1.5rem 0;
  color: var(--primary);
}
</style>