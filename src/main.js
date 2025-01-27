import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import * as config from './config'
import * as format from './utils/format'
import copy from 'copy-to-clipboard';

// import VConsole from 'vconsole'
// new VConsole();


// 初始化 Pinia
const pinia = createPinia()
const app = createApp(App)

// 全局配置
app.config.globalProperties.$config = config
app.config.globalProperties.$format = format
app.config.globalProperties.$copy = copy

app.use(pinia)
app.use(router)
app.mount('#app')