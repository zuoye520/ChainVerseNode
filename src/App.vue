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
import { ref, getCurrentInstance,provide, watch } from 'vue'
import Header from './components/Header.vue'
import Loading from './components/Loading.vue'
import Toast from './components/Toast.vue'
import Modal from './components/Modal.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useWalletStore } from './stores/wallet'
import { storeToRefs } from 'pinia'

const walletStore = useWalletStore()
const { error } = storeToRefs(walletStore)
const { proxy } = getCurrentInstance()
// Loading state
const isLoading = ref(false)
const loadingText = ref('Loading')
const showErrorModal = ref(true)

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
  --primary: #00e789;
  --primary-dark: #00cc76;
  --bg-dark: #0a0b0e;
  --text: rgba(255, 255, 255, 0.7);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: var(--bg-dark);
  color: var(--text);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
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
}

.cyber-button.secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text);
}

.cyber-button.primary {
  background: var(--primary);
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
  background: var(--primary-dark);
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
</style>