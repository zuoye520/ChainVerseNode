<template>
  <div class="profile">
    <div class="container">
      <div class="profile-grid">
        <div class="profile-sidebar">
          <div class="avatar-section">
            <div class="avatar">
              <img :src="avatarUrl" alt="Profile" class="avatar-img">
              <button class="camera-btn">
                <CameraIcon class="camera-icon" />
              </button>
              <div class="avatar-glow"></div>
            </div>
            <div class="primary-name">
              <h3>Primary Identity</h3>
              <p>{{ primaryName }}</p>
            </div>
          </div>

          <!-- <div class="sidebar-nav">
            <button 
              class="nav-item"
              :class="{ active: activeSection === 'profile' }"
              @click="activeSection = 'profile'"
            >
              MANAGE PROFILE
            </button>
            <button 
              class="nav-item"
              :class="{ active: activeSection === 'ownership' }"
              @click="activeSection = 'ownership'"
            >
              OWNERSHIP
            </button>
          </div> -->
        </div>

        <div class="profile-content">
          <h1>Manage Profile</h1>

          <div class="form-section">
            <h2>Description</h2>
            <div class="textarea-wrapper">
              <textarea 
                v-model="description" 
                placeholder="Tell us about yourself"
                maxlength="200"
                class="cyber-input"
              ></textarea>
              <span class="character-count">{{ 200 - description.length }} characters remaining</span>
            </div>
          </div>

          <div class="form-section">
            <h2>Location</h2>
            <input 
              type="text" 
              v-model="location" 
              placeholder="New York, NY, USA"
              class="cyber-input"
            >
          </div>

          <div class="form-section">
            <h2>Social Media</h2>
            <div class="social-inputs">
              <div class="social-input">
                <label>Twitter / X</label>
                <input 
                  type="text" 
                  v-model="socials.twitter" 
                  placeholder="Username"
                  class="cyber-input"
                >
              </div>
              <div class="social-input">
                <label>Farcaster</label>
                <input 
                  type="text" 
                  v-model="socials.farcaster" 
                  placeholder="Username"
                  class="cyber-input"
                >
              </div>
              <div class="social-input">
                <label>Github</label>
                <input 
                  type="text" 
                  v-model="socials.github" 
                  placeholder="Username"
                  class="cyber-input"
                >
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>Websites</h2>
            <div class="website-inputs">
              <input 
                type="url" 
                v-model="websites[0]" 
                placeholder="www.example.com"
                class="cyber-input"
              >
              <input 
                type="url" 
                v-model="websites[1]" 
                placeholder="www.myproject.com"
                class="cyber-input"
              >
              <input 
                type="url" 
                v-model="websites[2]" 
                placeholder="www.portfolio.com"
                class="cyber-input"
              >
            </div>
          </div>

          <div class="form-actions">
            <button class="cyber-button" @click="saveProfile">
              <span>Save Changes</span>
              <div class="button-glitch"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, onUpdated, onUnmounted } from 'vue'
import { CameraIcon } from '@heroicons/vue/24/outline'
import '../styles/ProfileView.css'

const activeSection = ref('profile')
const avatarUrl = ref('https://api.dicebear.com/7.x/identicon/svg?seed=nuls')
const primaryName = ref('zz888888.nuls')
const description = ref('')
const location = ref('')
const socials = ref({
  twitter: '',
  farcaster: '',
  github: ''
})
const websites = ref(['', '', ''])

onBeforeMount(() => {
  console.log('Component will be mounted')
  initializeData()
})

onMounted(() => {
  console.log('Component mounted')
  loadUserProfile()
})

onUpdated(() => {
  console.log('Component updated')
})

onUnmounted(() => {
  console.log('Component will be unmounted')
  saveProfileToLocalStorage()
})

const initializeData = () => {
  // Initialize data
  const savedProfile = localStorage.getItem('userProfile')
  if (savedProfile) {
    const profile = JSON.parse(savedProfile)
    description.value = profile.description || ''
    location.value = profile.location || ''
    socials.value = profile.socials || { twitter: '', farcaster: '', github: '' }
    websites.value = profile.websites || ['', '', '']
  }
}

const loadUserProfile = () => {
  // Load user profile
  console.log('Loading user profile')
}

const saveProfileToLocalStorage = () => {
  // Save to local storage
  const profile = {
    description: description.value,
    location: location.value,
    socials: socials.value,
    websites: websites.value
  }
  localStorage.setItem('userProfile', JSON.stringify(profile))
}

const saveProfile = () => {
  saveProfileToLocalStorage()
  console.log('Profile saved')
}
</script>