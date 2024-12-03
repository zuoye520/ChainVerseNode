<template>
  <header class="header">
    <nav class="nav-container">
      <router-link to="/" class="logo">
        <div class="logo-wrapper">
          <div class="logo-text">
            <span class="nuls">NULS</span>
            <div class="ai-container">
              <span class="ai">AI</span>
              <div class="ai-effects">
                <div class="circuit-lines"></div>
                <div class="pulse"></div>
                <div class="glow"></div>
              </div>
            </div>
          </div>
          <div class="logo-underline"></div>
        </div>
      </router-link>
      <div class="nav-links" :class="{ 'active': isMenuOpen }">
        <router-link to="/my-identity" @click="closeMenu">My Identity</router-link>
        <router-link to="/ai-training" @click="closeMenu">AI Training</router-link>
      </div>
      <div class="right-section">
        <button class="menu-dots-btn" @click="toggleSocialMenu">
          <EllipsisHorizontalIcon class="dots-icon" />
        </button>
        
        <div v-show="showSocialMenu" class="social-menu" @click.stop>
          <div class="menu-section">
            <h4 class="section-title">Help & Support</h4>
            <router-link to="/about" class="menu-item" @click="toggleSocialMenu">
              <BookOpenIcon class="menu-icon" />
              <div class="menu-item-content">
                <span class="menu-item-title">About</span>
                <span class="menu-item-description">Learn more about NULS AI</span>
              </div>
            </router-link>
          </div>
          <div class="menu-section">
            <h4 class="section-title">Community</h4>
            <div class="social-buttons">
              <a :href="proxy.$config.TG_URL" target="_blank" class="social-button" title="Telegram">
                <img src="/telegram.svg" alt="Telegram" class="social-icon telegram-icon">
              </a>
              <a :href="proxy.$config.DC_URL" target="_blank" class="social-button" title="Discord">
                <img src="/discord.svg" alt="Discord" class="social-icon">
              </a>
              <a :href="proxy.$config.TW_URL" target="_blank" class="social-button" title="Twitter">
                <img src="/twitter.svg" alt="Twitter" class="social-icon">
              </a>
              <a :href="proxy.$config.GITHUB_URL" target="_blank" class="social-button" title="GitHub">
                <img src="/github.svg" alt="GitHub" class="social-icon">
              </a>
            </div>
          </div>
        </div>

        <WalletSection />
        <button class="menu-btn" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import WalletSection from './WalletSection.vue'
import { EllipsisHorizontalIcon, BookOpenIcon } from '@heroicons/vue/24/outline'

const { proxy } = getCurrentInstance()
const isMenuOpen = ref(false)
const showSocialMenu = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleSocialMenu = (event) => {
  event.stopPropagation()
  showSocialMenu.value = !showSocialMenu.value
}

const handleClickOutside = (event) => {
  if (showSocialMenu.value && !event.target.closest('.menu-dots-btn')) {
    showSocialMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.header {
  background: rgba(10, 11, 14, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  height: var(--header-height);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 101;
}

.logo-wrapper {
  position: relative;
  padding: 0.5rem;
}

.logo-text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 800;
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  position: relative;
}

.nuls {
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  position: relative;
}

.ai-container {
  position: relative;
  height: 2rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai {
  color: var(--primary);
  font-size: 0.9em;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 10px rgba(0, 228, 134, 0.5);
  animation: pulse 2s infinite;
}

.ai-effects {
  position: absolute;
  inset: -0.25rem;
  pointer-events: none;
}

.circuit-lines {
  position: absolute;
  inset: 0;
  border: 1px solid var(--primary);
  border-radius: 4px;
  opacity: 0.5;
  background: 
    linear-gradient(90deg, transparent 50%, var(--primary) 50%) -2px 0/4px 1px repeat-x,
    linear-gradient(90deg, transparent 50%, var(--primary) 50%) -2px 100%/4px 1px repeat-x;
  animation: circuit-animate 20s linear infinite;
}

.pulse {
  position: absolute;
  inset: -0.5rem;
  border: 1px solid var(--primary);
  border-radius: 4px;
  animation: pulse-animate 2s infinite;
}

.glow {
  position: absolute;
  inset: 0;
  background: var(--primary);
  filter: blur(20px);
  opacity: 0.2;
  border-radius: 4px;
  animation: glow-animate 2s infinite;
}

.logo-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent,
    var(--primary),
    transparent
  );
  opacity: 0.5;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: all 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  position: relative;
  font-size: clamp(0.875rem, 2vw, 1rem);
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: white;
}

.nav-links a::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--primary);
  border-radius: 8px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s;
}

.nav-links a:hover::before,
.nav-links a.router-link-active::before {
  opacity: 0.1;
  transform: scale(1);
}

.right-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 101;
}

.menu-dots-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s;
}

.menu-dots-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary);
}

.dots-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--text);
}

.social-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(10, 11, 14, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 280px;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

.menu-section {
  padding: 0.75rem;
}

.menu-section:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.75rem;
}

.social-button {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s;
}

.social-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text);
}

.telegram-icon {
  filter: invert(0.7);
}

.social-button:hover .social-icon {
  color: var(--primary);
}

.menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  z-index: 102;
}

.menu-btn span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--primary);
  transition: all 0.3s;
  border-radius: 2px;
}

.menu-btn.active span:nth-child(1) {
  transform: translateY(9.5px) rotate(45deg);
}

.menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.menu-btn.active span:nth-child(3) {
  transform: translateY(-9.5px) rotate(-45deg);
}

@keyframes circuit-animate {
  from {
    background-position: 0 0, 0 100%;
  }
  to {
    background-position: 100% 0, 100% 100%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes pulse-animate {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.2;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

@keyframes glow-animate {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.3;
  }
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

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-links {
    display: none;
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: rgba(10, 11, 14, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 1rem;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    height: calc(100vh - var(--header-height));
  }

  .nav-links.active {
    display: flex;
  }

  .nav-links a {
    width: 100%;
    text-align: center;
    padding: 1rem;
    font-size: 1.1rem;
  }

  .menu-btn {
    display: flex;
  }

  .social-menu {
    position: fixed;
    top: 100%;
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

  .ai-container {
    height: 1.75rem;
    width: 2.25rem;
  }
}

/* Add active state for touch devices */
@media (hover: none) {
  .nav-links a:active::before {
    opacity: 0.1;
    transform: scale(1);
  }

  .menu-dots-btn:active,
  .social-button:active {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

/* Fix for iOS Safari 100vh issue */
@supports (-webkit-touch-callout: none) {
  .nav-links {
    height: -webkit-fill-available;
  }
}
</style>
