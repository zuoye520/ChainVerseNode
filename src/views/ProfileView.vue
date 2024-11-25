<template>
  <div class="profile">
    <div class="container">
      <div class="profile-grid">
        <div class="profile-sidebar">
          <div class="avatar-section">
            <div class="avatar">
              <img 
                :src="avatarUrl" 
                alt="Profile" 
                class="avatar-img"
                @error="handleImageError"
              >
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileSelect" 
                accept="image/*"
                class="hidden-input"
              >
              <label class="camera-btn" @click.prevent="triggerFileInput">
                <CameraIcon class="camera-icon" />
              </label>
              <div class="avatar-glow"></div>
            </div>
            <button 
              class="save-avatar-btn"
              @click="saveAvatar"
              v-show="selectedFile"
            >
              Save Avatar
            </button>
            <div v-if="primaryDomain" class="primary-name">
              <h3>Primary Identity</h3>
              <p>{{ primaryDomainOmit }}</p>
            </div>
          </div>
        </div>

        <div class="profile-content">
          <h1>Manage Profile</h1>

          <div class="form-section">
            <h2>Description</h2>
            <div class="textarea-wrapper">
              <textarea 
                v-model="description" 
                placeholder="Tell us about yourself (max 200 characters)"
                maxlength="200"
                class="cyber-input"
                :class="{ 'error': validationErrors.description }"
              ></textarea>
              <span class="character-count" :class="{ 'error': description.length >= 200 }">
                {{ 200 - description.length }} characters remaining
              </span>
              <span v-if="validationErrors.description" class="error-message">
                {{ validationErrors.description }}
              </span>
            </div>
          </div>

          <div class="form-section">
            <h2>Location</h2>
            <input 
              type="text" 
              v-model="location" 
              placeholder="New York, NY, USA"
              class="cyber-input"
              :class="{ 'error': validationErrors.location }"
              maxlength="100"
            >
            <span v-if="validationErrors.location" class="error-message">
              {{ validationErrors.location }}
            </span>
          </div>

          <div class="form-section">
            <h2>Social Media</h2>
            <div class="social-inputs">
              <div class="social-input">
                <label>Twitter / X</label>
                <input 
                  type="text" 
                  v-model="socials.twitter" 
                  placeholder="Username without @"
                  class="cyber-input"
                  :class="{ 'error': validationErrors['socials.twitter'] }"
                >
                <span v-if="validationErrors['socials.twitter']" class="error-message">
                  {{ validationErrors['socials.twitter'] }}
                </span>
              </div>
              <div class="social-input">
                <label>Discord</label>
                <input 
                  type="text" 
                  v-model="socials.discord" 
                  placeholder="Username#0000"
                  class="cyber-input"
                  :class="{ 'error': validationErrors['socials.discord'] }"
                >
                <span v-if="validationErrors['socials.discord']" class="error-message">
                  {{ validationErrors['socials.discord'] }}
                </span>
              </div>
              <div class="social-input">
                <label>Farcaster</label>
                <input 
                  type="text" 
                  v-model="socials.farcaster" 
                  placeholder="Username"
                  class="cyber-input"
                  :class="{ 'error': validationErrors['socials.farcaster'] }"
                >
                <span v-if="validationErrors['socials.farcaster']" class="error-message">
                  {{ validationErrors['socials.farcaster'] }}
                </span>
              </div>
              <div class="social-input">
                <label>Github</label>
                <input 
                  type="text" 
                  v-model="socials.github" 
                  placeholder="Username"
                  class="cyber-input"
                  :class="{ 'error': validationErrors['socials.github'] }"
                >
                <span v-if="validationErrors['socials.github']" class="error-message">
                  {{ validationErrors['socials.github'] }}
                </span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>Websites</h2>
            <div class="website-inputs">
              <div v-for="(website, index) in websites" :key="index" class="website-input">
                <input 
                  type="url" 
                  v-model="websites[index]" 
                  :placeholder="'https://example.com'"
                  class="cyber-input"
                  :class="{ 'error': validationErrors[`websites.${index}`] }"
                >
                <span v-if="validationErrors[`websites.${index}`]" class="error-message">
                  {{ validationErrors[`websites.${index}`] }}
                </span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="cyber-button" @click="saveProfile" :disabled="isSaving">
              <span v-if="isSaving">
                <ArrowPathIcon class="spin-icon" />
                Saving...
              </span>
              <span v-else>Save Changes</span>
              <div class="button-glitch"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '../styles/ProfileView.css'
import { ref, inject, getCurrentInstance, onMounted, onBeforeMount, onUpdated, onUnmounted } from 'vue'
import { useWalletStore } from '../stores/wallet'
import { storeToRefs } from 'pinia'
const walletStore = useWalletStore()
const { account, currentChainConfig, primaryDomain,primaryDomainOmit, userUri } = storeToRefs(walletStore)
const { proxy } = getCurrentInstance()
import { CameraIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const toast = inject('toast')
const loading = inject('loading')

const DEFAULT_AVATAR = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULS.png'
const activeSection = ref('profile')
const avatarUrl = ref(DEFAULT_AVATAR)
const avatarUriHash = ref('')
const description = ref('')
const location = ref('')
const socials = ref({
  twitter: '',
  discord: '',
  farcaster: '',
  github: ''
})
const websites = ref(['', '', ''])
const selectedFile = ref(null)
const fileInput = ref(null)
const isSaving = ref(false)
const validationErrors = ref({})

onBeforeMount(() => {
  initializeData()
})

onMounted(() => {
  loadUserProfile()
})

onUpdated(() => {
  console.log('Component updated')
})

onUnmounted(() => {
  saveProfileToLocalStorage()
})

const initializeData = () => {
  const savedProfile = localStorage.getItem('userProfile')
  if (savedProfile) {
    const profile = JSON.parse(savedProfile)
    description.value = profile.description || ''
    location.value = profile.location || ''
    socials.value = profile.socials || { twitter: '', discord: '', farcaster: '', github: '' }
    websites.value = profile.websites || ['', '', '']
    if (profile.avatarUrl) {
      avatarUrl.value = profile.avatarUrl
      avatarUriHash.value = profile.avatarUriHash
    }
  }
}

const loadUserProfile = async () => {
  if(!account.value) return;
  try {
    if (userUri.value) {
      const {data:userProfile} = await walletStore.getFile(userUri.value)
      console.log('userProfile:',userProfile)
      if (userProfile) {
        description.value = userProfile.description || ''
        location.value = userProfile.location || ''
        socials.value = userProfile.socials || { twitter: '', discord: '', farcaster: '', github: '' }
        websites.value = userProfile.websites || ['', '', '']
        if (userProfile.avatarUrl) {
          avatarUrl.value = userProfile.avatarUrl
          avatarUriHash.value = userProfile.avatarUriHash
        }
      }
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
    toast.show('Failed to load profile', 'error')
  }
}

const saveProfileToLocalStorage = () => {
  const profile = {
    description: description.value,
    location: location.value,
    socials: socials.value,
    websites: websites.value,
    avatarUrl: avatarUrl.value,
    avatarUriHash: avatarUriHash.value
  }
  localStorage.setItem('userProfile', JSON.stringify(profile))
}

const handleImageError = () => {
  avatarUrl.value = DEFAULT_AVATAR
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    toast.show('Please select an image file', 'error')
    return
  }
  
  // 验证文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.show('Image size should be less than 5MB', 'error')
    return
  }

  selectedFile.value = file
  avatarUrl.value = URL.createObjectURL(file)
}

const saveAvatar = async () => {
  if (!primaryDomain.value){
    toast.show('Please register AI identity first', 'warning')
    return
  }
  if (!selectedFile.value) return

  try {
    loading.show('Uploading avatar...')
    const result = await walletStore.uploadFile(selectedFile.value)
    console.log('uploadFile result:', result)
    avatarUrl.value = `https://${proxy.$config.IPFS_CONFIG.gateway}/ipfs/${result.IpfsHash}`
    avatarUriHash.value = result.IpfsHash
    selectedFile.value = null
    await saveProfile()
    toast.show('Avatar updated successfully', 'success')
  } catch (error) {
    console.error('Failed to upload avatar:', error)
    toast.show('Failed to upload avatar', 'error')
    avatarUrl.value = DEFAULT_AVATAR
  } finally {
    loading.hide()
  }
}

const validateForm = () => {
  const errors = {}

  // Description validation
  if (description.value.length > 200) {
    errors.description = 'Description must not exceed 200 characters'
  }

  // Location validation
  if (location.value.length > 100) {
    errors.location = 'Location must not exceed 100 characters'
  }

  // Social media validation
  if (socials.value.twitter && !/^[A-Za-z0-9_]{1,15}$/.test(socials.value.twitter)) {
    errors['socials.twitter'] = 'Invalid Twitter username'
  }

  if (socials.value.discord && !/^.{3,32}#[0-9]{4}$/.test(socials.value.discord)) {
    errors['socials.discord'] = 'Invalid Discord username (format: username#0000)'
  }

  if (socials.value.github && !/^[A-Za-z0-9-]+$/.test(socials.value.github)) {
    errors['socials.github'] = 'Invalid GitHub username'
  }

  if (socials.value.farcaster && !/^[A-Za-z0-9_]{1,32}$/.test(socials.value.farcaster)) {
    errors['socials.farcaster'] = 'Invalid Farcaster username'
  }

  // Website validation
  websites.value.forEach((website, index) => {
    if (website && !isValidUrl(website)) {
      errors[`websites.${index}`] = 'Invalid website URL'
    }
  })

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

const saveProfile = async () => {
  if (!primaryDomain.value){
    toast.show('Please register AI identity first', 'warning')
    return
  }
  if (!validateForm()) {
    toast.show('Please fix the validation errors', 'error')
    return
  }
  try {
    isSaving.value = true
    loading.show('Saving profile...')

    const profileData = {
      description: description.value,
      location: location.value,
      socials: socials.value,
      websites: websites.value,
      avatarUriHash: avatarUriHash.value,
      avatarUrl: avatarUrl.value,
    }

    const result = await walletStore.uploadJson(profileData)
    console.log('uploadJson result:', result)

    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "setUserURI",
      args: [result.IpfsHash]
    }
    const resUri = await walletStore.contractCall(data)
    console.log('resUri:', resUri)
    saveProfileToLocalStorage()
    
    toast.show('Profile saved successfully', 'success')
  } catch (error) {
    console.error('Failed to save profile:', error)
    toast.show('Failed to save profile', 'error')
  } finally {
    isSaving.value = false
    loading.hide()
  }
}
</script>

<style scoped>
.error-message {
  color: #ff4d4d;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.cyber-input.error {
  border-color: #ff4d4d;
}

.character-count.error {
  color: #ff4d4d;
}

.website-input {
  margin-bottom: 1rem;
}

.spin-icon {
  animation: spin 1s linear infinite;
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

.hidden-input {
  display: none;
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 3;
  padding: 0;
}

.camera-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--primary);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>