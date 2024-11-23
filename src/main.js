import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import * as config from './config'
import * as format from './utils/format'

// 初始化 Pinia
const pinia = createPinia()
const app = createApp(App)

// 全局配置
app.config.globalProperties.$config = config
app.config.globalProperties.$format = format

app.use(pinia)
app.use(router)
app.mount('#app')