import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import * as config from './config'
import * as format from './utils/format'
import { useToast } from './composables/useToast'

// Initialize Pinia
const pinia = createPinia()
const app = createApp(App)
// 全局配置
app.config.globalProperties.$config = config
app.config.globalProperties.$format = format
// 创建全局 toast 实例
const toast = useToast()
app.config.globalProperties.$toast = toast

app.use(pinia)
app.use(router)
app.mount('#app')