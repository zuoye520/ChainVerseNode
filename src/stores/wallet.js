import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { walletService } from '../services/wallet'
import * as api from '../services/api'
import { CHAINS ,NABOX_DOWNLOAD_URL} from '../config'
export const useWalletStore = defineStore('wallet', () => {
  const account = ref(null)
  const chainInfo = ref(null)
  const networkStatus = ref({ connected: false, chainId: null, error: null })
  const isConnecting = ref(false)
  const error = ref(null)

  const isConnected = computed(() => !!account.value)
  const shortAddress = computed(() => {
    if (!account.value) return ''
    return `${account.value.slice(0, 6)}...${account.value.slice(-4)}`
  })
  const currentChainConfig = computed(() => {
    if (!chainInfo.value) return ''
    return CHAINS[chainInfo.value.chainId*1];
  })

  async function connect() {
    if (!walletService.isNaboxInstalled()) {
      error.value = '请安装 NABOX 钱包'
      window.open(NABOX_DOWNLOAD_URL, '_blank')
      return;
    }

    try {
      isConnecting.value = true
      error.value = null
      
      const address = await walletService.connect()
      account.value = address
      
      const info = await walletService.getChainInfo()
      console.log('getChainInfo:',info)
      chainInfo.value = info
      console.log('walletInfo:',{account,chainInfo})
      // 设置监听器
      setupEventListeners()
      
      // 检查网络状态
      await checkNetwork()

    } catch (err) {
      error.value = err.message || '连接钱包失败'
      console.error('钱包连接失败:', err)
      account.value = null
      chainInfo.value = null
    } finally {
      isConnecting.value = false
    }
  }

  function setupEventListeners() {
    walletService.onAccountsChanged((accounts) => {
      account.value = accounts[0] || null
      if (!accounts[0]) {
        disconnect()
      }
    })

    walletService.onChainChanged(async () => {
      try {
        const info = await walletService.getChainInfo()
        chainInfo.value = info
        await checkNetwork()
      } catch (err) {
        console.error('链更新失败:', err)
        disconnect()
      }
    })
  }

  async function checkNetwork() {
    const status = await walletService.checkNetworkStatus()
    networkStatus.value = status
    
    if (!status.connected || status.error) {
      error.value = status.error || '网络连接失败'
    }
  }

  function disconnect() {
    account.value = null
    chainInfo.value = null
    error.value = null
    networkStatus.value = { connected: false, chainId: null, error: null }
    walletService.disconnect()
  }
  async function invokeView(data){
    try {
     return await walletService.nabox.invokeView(data)
    } catch (error) {
      throw new Error(error)
    }
  }
  async function contractCall(data){
    try {
     return await walletService.nabox.contractCall(data)
    } catch (error) {
      throw new Error(error)
    }
  }
  // 初始化
  async function init() {
    if (walletService.isNaboxInstalled()) {
      try {
        const currentAccount = await walletService.getAccount()
        if (currentAccount) {
          account.value = currentAccount
          chainInfo.value = await walletService.getChainInfo()
          console.log('walletInfo:',{account,chainInfo})
          await checkNetwork()
          setupEventListeners()
        }
      } catch (err) {
        console.warn('钱包初始化失败:', err)
        disconnect()
      }
    }
  }

  return {
    account,
    chainInfo,
    networkStatus,
    isConnecting,
    error,
    isConnected,
    shortAddress,
    connect,
    disconnect,
    init,
    checkNetwork,
    invokeView,
    contractCall,
    currentChainConfig
  }
})