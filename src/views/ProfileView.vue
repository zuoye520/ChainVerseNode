<template>
  <div class="profile">
    <div class="container">
      <div class="profile-grid">
        <div class="profile-sidebar">
          <div class="avatar-section">
            <div class="avatar">
              <img :src="avatarUrl" alt="Profile" class="avatar-img">
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileSelect" 
                accept="image/*"
                style="display: none"
              >
              <button class="camera-btn" @click="triggerFileInput">
                <CameraIcon class="camera-icon" />
              </button>
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
              <p>{{ primaryDomain }}</p>
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
                <label>Discord</label>
                <input 
                  type="text" 
                  v-model="socials.discord" 
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
            <button class="cyber-button" @click="saveProfile" :disabled="isSaving">
              <span v-if="isSaving">Saving...</span>
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
import { ref, inject,getCurrentInstance, onMounted, onBeforeMount, onUpdated, onUnmounted } from 'vue'
import { useWalletStore } from '../stores/wallet'
import { storeToRefs } from 'pinia'
const walletStore = useWalletStore()
const {account,currentChainConfig,primaryDomain} = storeToRefs(walletStore)
// 获取全局配置
const { proxy } = getCurrentInstance()
import { CameraIcon } from '@heroicons/vue/24/outline'

const toast = inject('toast')
const loading = inject('loading')

const activeSection = ref('profile')
const avatarUrl = ref('https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULS.png')
const avatarUriHash = ref('')
const primaryName = ref('zz888888.nuls')
const description = ref('')
const location = ref('')
const socials = ref({
  twitter: '',
  discord:'',
  farcaster: '',
  github: ''
})
const websites = ref(['', '', ''])

// 新增的状态
const selectedFile = ref(null)
const fileInput = ref(null)
const isSaving = ref(false)

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
    socials.value = profile.socials || { twitter: '', farcaster: '', github: '' }
    websites.value = profile.websites || ['', '', '']
    if (profile.avatarUrl) {
      avatarUrl.value = profile.avatarUrl
      avatarUriHash.value = profile.avatarUriHash
    }
  }
}

const loadUserProfile = async () => {
   const result = await  walletStore.invokeView({
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName:"userURI",
      methodDesc: "(String domain) return String",
      args: []
    });
    console.log('userURI:',userURI)
    //通过ipfs解析
    const userProfile = await walletStore.getFile(result.result)
  console.log('Loading user profile',userProfile)
  //存储到本地
}

const saveProfileToLocalStorage = () => {
  const profile = {
    description: description.value,
    location: location.value,
    socials: socials.value,
    websites: websites.value,
    avatarUrl: avatarUrl.value,
    avatarUriHash:avatarUriHash.value
  }
  localStorage.setItem('userProfile', JSON.stringify(profile))
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  
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

// 保存头像
const saveAvatar = async () => {
  if (!selectedFile.value) return

  try {
    loading.show('Uploading avatar...')
    const result = await walletStore.uploadFile(selectedFile.value)
    console.log('uploadFile result:',result)
    // 更新头像URL
    avatarUrl.value = `https://${proxy.$config.IPFS_CONFIG.gateway}/ipfs/${result.IpfsHash}`;
    avatarUriHash.value = result.IpfsHash;
    selectedFile.value = null;
    
    toast.show('Avatar updated successfully', 'success')
  } catch (error) {
    console.error('Failed to upload avatar:', error)
    toast.show('Failed to upload avatar', 'error')
  } finally {
    loading.hide()
  }
}

// 保存个人信息
const saveProfile = async () => {
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
    console.log('uploadJson result:',result)

    //存储ipfs hash到UserURI
    const data = {
      from: account.value,
      value: 0,
      contractAddress: currentChainConfig.value.contracts.domainAddress,
      methodName: "setUserURI",
      args: [result.IpfsHash]
    }
    const resUri = await walletStore.contractCall(data)
    console.log('resUri:',resUri)
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

