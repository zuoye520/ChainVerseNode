<template>
  <div class="settings-dropdown">
    <button @click="toggleSettings" class="settings-btn" :class="{ 'active': showSettings }">
      <Cog6ToothIcon class="settings-icon" />
    </button>
    <div v-if="showSettings" class="settings-menu" @click.stop>
      <div class="settings-section">
        <h3 class="settings-title">
          <LanguageIcon class="section-icon" />
          Language
        </h3>
        <select v-model="selectedLanguage" class="select-input">
          <option value="en">English (EN)</option>
          <option value="zh">中文 (ZH)</option>
          <option value="ko">한국어 (KO)</option>
          <option value="ja">日本語 (JA)</option>
        </select>
      </div>

      <div class="settings-section">
        <h3 class="settings-title">
          <LinkIcon class="section-icon" />
          Social Media
        </h3>
        <div class="social-links">
          <a href="https://twitter.com/nuls" target="_blank" class="social-link">
            <img src="/twitter.svg" alt="Twitter" class="social-icon">
            Twitter
          </a>
          <a href="https://github.com/nuls" target="_blank" class="social-link">
            <img src="/github.svg" alt="GitHub" class="social-icon">
            GitHub
          </a>
          <a href="https://discord.gg/nuls" target="_blank" class="social-link">
            <img src="/discord.svg" alt="Discord" class="social-icon">
            Discord
          </a>
        </div>
      </div>

      <div class="settings-section">
        <div class="links-grid">
          <router-link to="/support" class="menu-link">Support</router-link>
          <router-link to="/feedback" class="menu-link">Feedback</router-link>
          <router-link to="/governance" class="menu-link">Governance</router-link>
          <router-link to="/community" class="menu-link">Community</router-link>
          <router-link to="/developers" class="menu-link">Developers</router-link>
          <router-link to="/bug-bounty" class="menu-link">Bug Bounty</router-link>
          <router-link to="/terms" class="menu-link">Terms of Use</router-link>
          <router-link to="/privacy" class="menu-link">Privacy Policy</router-link>
        </div>
      </div>

      <div class="settings-footer">
        <div class="network-status">
          <div class="status-dot"></div>
          Mainnet: 32.1 Gwei
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Cog6ToothIcon, LanguageIcon, LinkIcon } from '@heroicons/vue/24/outline'

const showSettings = ref(false)
const selectedLanguage = ref('en')

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const handleClickOutside = (event) => {
  if (showSettings.value && !event.target.closest('.settings-dropdown')) {
    showSettings.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.settings-dropdown {
  position: relative;
  margin-right: 1rem;
}

.settings-btn {
  height: 42px;
  width: 42px;
  padding: 0;
  background: #f8f9fa;
  border: 1px solid #eee;
  cursor: pointer;
  color: #666;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn:hover,
.settings-btn.active {
  background: #f0f0f0;
  color: #00e486;
  border-color: #00e486;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.settings-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.settings-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 320px;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
  z-index: 1000;
  border: 1px solid #eee;
}

.settings-section {
  padding: 1.25rem;
  border-bottom: 1px solid #eee;
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #00e486;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.select-input:hover {
  border-color: #00e486;
}

.select-input:focus {
  outline: none;
  border-color: #00e486;
  box-shadow: 0 0 0 2px rgba(0, 228, 134, 0.1);
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.social-link:hover {
  background: #f8f9fa;
  color: #00e486;
  border-color: #eee;
  transform: translate(2px);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.menu-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  padding: 0.5rem;
  border-radius: 6px;
}

.menu-link:hover {
  color: #00e486;
  background: #f8f9fa;
}

.settings-footer {
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.network-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00e486;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(0, 228, 134, 0.2);
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
  .settings-menu {
    position: fixed;
    top: 70px;
    left: 1rem;
    right: 1rem;
    width: auto;
  }
}
</style>