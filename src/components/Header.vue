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
        <router-link to="/my-domains" @click="closeMenu">My Identity</router-link>
      </div>
      <div class="right-section">
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
import { ref } from 'vue'
import WalletSection from './WalletSection.vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style scoped>
.header {
  background: rgba(10, 11, 14, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  font-size: 1.5rem;
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
  z-index: 100;
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

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .nav-links {
    display: none;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(10, 11, 14, 0.95);
    backdrop-filter: blur(10px);
    padding: 1rem;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-links.active {
    display: flex;
  }

  .nav-links a {
    width: 100%;
    text-align: center;
    padding: 1rem;
  }

  .menu-btn {
    display: flex;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.25rem;
  }
  
  .ai-container {
    height: 1.75rem;
    width: 2.25rem;
  }
}
</style>