<template>
  <div class="app">
    <Header />
    <router-view></router-view>
    <Toast />
    <Loading :show="isLoading" :text="loadingText" />
    
    <!-- Error Modal -->
    <Modal
      v-if="walletStore.error"
      v-model:show="showErrorModal"
      @close="closeErrorModal"
      title="Connection Error"
      size="small"
    >
      <div class="error-modal-content">
        <ExclamationTriangleIcon class="error-icon" />
        <p class="error-message">{{ walletStore.error }}{{ error }}</p>
      </div>
      
      <template #footer v-if="error.indexOf('install') >-1">
        <div class="modal-footer" >
          <button class="cyber-button secondary" @click="closeErrorModal">
            Cancel
          </button>
          <button class="cyber-button primary" @click="handleErrorAction">
            Install Nabox
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref,onMounted, getCurrentInstance,provide, watch } from 'vue'
import Header from './components/Header.vue'
import Loading from './components/Loading.vue'
import Toast from './components/Toast.vue'
import Modal from './components/Modal.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useWalletStore } from './stores/wallet'
import { storeToRefs } from 'pinia'
import { useReferStore } from './stores/refer'
const referStore = useReferStore()
const store = useWalletStore()
const { account } = storeToRefs(store)

const walletStore = useWalletStore()
const { error } = storeToRefs(walletStore)
const { proxy } = getCurrentInstance()
// Loading state
const isLoading = ref(false)
const loadingText = ref('Loading')
const showErrorModal = ref(true)

const urlParams = new URLSearchParams(window.location.search);
const inviteCode = ref(urlParams.get("inviteCode"));

onMounted(() => {
  handelInvite()
})

//缓存邀请地址
const handelInvite = ()=>{
  if(inviteCode.value){
    //缓存邀请码
    localStorage.setItem('inviteCode',inviteCode.value)
  }
}
//推荐注册
const handelRegister = async ()=>{
  const inviter = localStorage.getItem('inviteCode')
  //注册
  await referStore.register({
      address: account.value,
      inviter: inviter
    })
}

// Loading provider
provide('loading', {
  show: (text = 'Loading') => {
    loadingText.value = text
    isLoading.value = true
  },
  hide: () => {
    isLoading.value = false
  }
})

// Toast state
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 3000
})

let toastTimeout = null

// Toast provider
provide('toast', {
  show: (message, type = 'info', duration = 3000) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout)
    }
    
    toast.value = {
      show: true,
      message,
      type,
      duration
    }

    toastTimeout = setTimeout(() => {
      toast.value.show = false
    }, duration)
  },
  hide: () => {
    toast.value.show = false
    if (toastTimeout) {
      clearTimeout(toastTimeout)
    }
  }
})

// Provide toast state
provide('toastState', toast)

// Watch error changes
watch(error, (newError) => {
  if (newError) {
    showErrorModal.value = true
  }
})
// 监听页码变化
watch(account, (newAccount) => {
  //console.log('app.vue watch account:',newAccount)
  // 加载新页数据
  if(newAccount) handelRegister()
  
})

// Error modal methods
const closeErrorModal = () => {
  showErrorModal.value = false
  walletStore.$patch({ error: null })
}

const handleErrorAction = () => {
  if (error.value?.includes('install')) {
    window.open(proxy.$config.NABOX_DOWNLOAD_URL, '_blank')
  }
  closeErrorModal()
}
</script>

<style>
:root {
  --primary: #00c2ff;
  --primary-dark: #0099cc;
  --bg-dark: #0a0e17;
  --text: rgba(255, 255, 255, 0.7);
  --header-height: 70px;
  --container-padding: clamp(1rem, 5vw, 2rem);
  --accent-color: #ff5e3a;
  --gradient-primary: linear-gradient(135deg, #00c2ff 0%, #0066ff 100%);
  --gradient-accent: linear-gradient(135deg, #ff5e3a 0%, #ff3a6b 100%);
  --card-bg: rgba(20, 30, 48, 0.5);
  --border-color: rgba(0, 194, 255, 0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  font-size: 16px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: var(--bg-dark);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  background-image: radial-gradient(circle at 50% 0%, rgba(0, 194, 255, 0.1) 0%, transparent 70%);
}

.app {
  min-height: 100vh;
  padding-top: var(--header-height);
}

.error-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: #ff4d4d;
}

.error-message {
  text-align: center;
  color: var(--text);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cyber-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: clamp(0.875rem, 2vw, 1rem);
  touch-action: manipulation;
}

.cyber-button.secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text);
}

.cyber-button.primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
}

.cyber-button:hover {
  transform: translateY(-1px);
}

.cyber-button.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary);
}

.cyber-button.primary:hover {
  box-shadow: 0 4px 12px rgba(0, 194, 255, 0.3);
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

@media (max-width: 768px) {
  .modal-footer {
    flex-direction: column;
  }

  .cyber-button {
    width: 100%;
    justify-content: center;
    padding: 1rem;
  }

  .error-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .error-message {
    font-size: 0.9rem;
  }
}

/* Fix for iOS Safari 100vh issue */
@supports (-webkit-touch-callout: none) {
  .app {
    min-height: -webkit-fill-available;
  }
}

/* Add active state for touch devices */
@media (hover: none) {
  .cyber-button:active {
    transform: translateY(1px);
    opacity: 0.8;
  }
}
</style>