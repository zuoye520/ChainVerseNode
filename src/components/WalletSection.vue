<template>
  <div class="wallet-section">
    <button 
      v-if="!isConnected" 
      @click="connectWallet" 
      class="cyber-button"
      :disabled="isConnecting"
    >
      <span v-if="isConnecting">Connecting...</span>
      <span v-else>Connect Wallet</span>
      <div class="button-glitch"></div>
    </button>

    <div v-else>
      <button @click="toggleWalletMenu" class="wallet-btn" :class="{ 'active': showWalletMenu }">
        <WalletIcon class="wallet-icon" />
        {{ shortAddress }}
        <ChevronDownIcon class="chevron-icon" :class="{ 'rotate': showWalletMenu }" />
      </button>

      <div v-if="showWalletMenu" class="wallet-menu" @click.stop>
        <div class="wallet-menu-header">
          <div class="wallet-info">
            <div class="wallet-avatar">
              <img :src="walletAvatar" alt="Wallet Avatar" />
            </div>
            <div class="wallet-details">
              <h3>{{ shortAddress }}</h3>
              <div class="wallet-balance">
                <span class="balance-amount">{{ balance }} NULS</span>
                <span class="balance-usd">≈ ${{ balanceUsd }}</span>
              </div>
            </div>
          </div>
          <div class="wallet-actions">
            <button class="action-btn" @click="copyAddress" title="Copy Address">
              <DocumentDuplicateIcon class="action-icon" />
            </button>
            <button class="action-btn" @click="openExplorer" title="View on Explorer">
              <ArrowTopRightOnSquareIcon class="action-icon" />
            </button>
          </div>
        </div>

        <div class="wallet-menu-content">
          <div class="menu-section">
            <h4 class="section-title">Account</h4>
            <router-link to="/profile" custom v-slot="{ navigate }">
              <button class="menu-item" @click="goToProfile(navigate)">
                <UserCircleIcon class="menu-icon" />
                <div class="menu-item-content">
                  <span class="menu-item-title">Profile</span>
                  <span class="menu-item-description">View and edit your profile</span>
                </div>
              </button>
            </router-link>
          </div>
          <div class="menu-section">
            <h4 class="section-title">Settings</h4>
            <button class="menu-item" @click="toggleLanguage">
              <LanguageIcon class="menu-icon" />
              <div class="menu-item-content">
                <span class="menu-item-title">Language</span>
                <span class="menu-item-description">{{ currentLanguage }}</span>
              </div>
            </button>
          </div>

          <div class="menu-section">
            <h4 class="section-title">Help & Support</h4>
            <a href="https://docs.nuls.io" target="_blank" class="menu-item">
              <BookOpenIcon class="menu-icon" />
              <div class="menu-item-content">
                <span class="menu-item-title">Documentation</span>
                <span class="menu-item-description">Learn more about NULS AI</span>
              </div>
            </a>
            <a href="https://discord.gg/nuls" target="_blank" class="menu-item">
              <ChatBubbleLeftRightIcon class="menu-icon" />
              <div class="menu-item-content">
                <span class="menu-item-title">Community</span>
                <span class="menu-item-description">Join our Discord server</span>
              </div>
            </a>
          </div>

          <div class="menu-section">
            <button class="menu-item disconnect" @click="disconnectWallet">
              <ArrowRightOnRectangleIcon class="menu-icon" />
              <div class="menu-item-content">
                <span class="menu-item-title">Disconnect</span>
                <span class="menu-item-description">Sign out of your wallet</span>
              </div>
            </button>
          </div>
        </div>

        <div class="wallet-menu-footer">
          <div class="network-status">
            <div class="status-dot"></div>
            <span>NULS Network</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <div v-if="error" class="error-toast">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref,inject, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
const { proxy } = getCurrentInstance()
const toast = inject('toast');
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  LanguageIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'
import { WalletIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const walletStore = useWalletStore()
const { isConnected, shortAddress, error, isConnecting } = storeToRefs(walletStore)

const showWalletMenu = ref(false)
const currentLanguage = ref('English')
const walletAvatar = ref('https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULS.png')
const balance = ref('0.00')
const balanceUsd = ref('0.00')

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  walletStore.init()
  updateWalletAvatar()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function updateWalletAvatar() {
  if (isConnected.value) {
    walletAvatar.value = `https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULS.png`
  }
}

async function connectWallet() {
  await walletStore.connect()
  if (isConnected.value) {
    updateWalletAvatar()
  }
}

function disconnectWallet() {
  walletStore.disconnect()
  showWalletMenu.value = false
}

function copyAddress() {
  if (walletStore.account) {
    proxy.$copy(walletStore.account)
    toast.show('Copy success', 'success')
  }
}

function openExplorer() {
  if (walletStore.account) {
    window.open(`${walletStore.currentChainConfig.explorer}/address/info?address=${walletStore.account}`, '_blank')
  }
}

function goToProfile(navigate) {
  showWalletMenu.value = false
  navigate()
}

function toggleLanguage() {
  currentLanguage.value = currentLanguage.value === 'English' ? '中文' : 'English'
}

function handleClickOutside(event) {
  if (showWalletMenu.value && !event.target.closest('.wallet-section')) {
    showWalletMenu.value = false
  }
}

function toggleWalletMenu() {
  showWalletMenu.value = !showWalletMenu.value
}
</script>

<style scoped>
.wallet-section {
  position: relative;
}

.cyber-button {
  position: relative;
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
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
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.cyber-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.wallet-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.wallet-btn:hover,
.wallet-btn.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary);
}

.wallet-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

.wallet-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(10, 11, 14, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  width: 320px;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
}

.wallet-menu-header {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.wallet-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
}

.wallet-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wallet-details h3 {
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.wallet-balance {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.balance-amount {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.balance-usd {
  color: var(--text);
  font-size: 0.8rem;
}

.wallet-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--primary);
  transform: translateY(-1px);
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.wallet-menu-content {
  padding: 0.75rem;
}

.menu-section {
  padding: 0.5rem 0;
}

.menu-section:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
}

.section-title {
  color: var(--text);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
}

.menu-item {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  text-decoration: none;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(2px);
}

.menu-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  color: var(--text);
}

.menu-item:hover .menu-icon {
  color: var(--primary);
}

.menu-item-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.menu-item-title {
  font-weight: 500;
  font-size: 0.9rem;
}

.menu-item-description {
  color: var(--text);
  font-size: 0.8rem;
}

.menu-item.disconnect {
  color: #ff4d4d;
}

.menu-item.disconnect:hover {
  background: rgba(255, 77, 77, 0.1);
}

.menu-item.disconnect .menu-icon {
  color: #ff4d4d;
}

.menu-item.disconnect .menu-item-description {
  color: rgba(255, 77, 77, 0.8);
}

.wallet-menu-footer {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.network-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(0, 228, 134, 0.2);
}

.error-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, 1rem);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 768px) {
  .cyber-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .wallet-menu {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    margin: 0;
    border-radius: 12px 12px 0 0;
    animation: slideUp 0.2s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>