<template>
  <div class="app">
    <Header />
    <router-view></router-view>
    <Toast :toast="$toast.toast" />
    <Loading :show="isLoading" :text="loadingText" />
    
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Header from './components/Header.vue'
import Loading from './components/Loading.vue'
import Toast from './components/Toast.vue'

const isLoading = ref(false)
const loadingText = ref('Loading')

// Provide loading control to all components
provide('loading', {
  show: (text = 'Loading') => {
    loadingText.value = text
    isLoading.value = true
  },
  hide: () => {
    isLoading.value = false
  }
})
</script>

<style>
:root {
  --primary: #00e486;
  --primary-dark: #00cc76;
  --bg-dark: #0a0b0e;
  --text: rgba(255, 255, 255, 0.7);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: var(--bg-dark);
  color: var(--text);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}
</style>