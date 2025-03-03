<template>
  <Transition name="loading">
    <div v-if="show" class="loading-overlay">
      <div class="loading-container">
        <div class="cyber-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-core"></div>
          <div class="spinner-particles">
            <div v-for="n in 8" :key="n" class="particle"></div>
          </div>
        </div>
        <div class="loading-text">
          <span class="text">{{ text }}</span>
          <span class="dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Loading'
  }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 23, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.cyber-spinner {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring::before {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px solid transparent;
  border-top-color: var(--primary);
  border-radius: 50%;
  opacity: 0.5;
  animation: spin 2s linear infinite;
}

.spinner-core {
  position: absolute;
  inset: 20%;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(8px);
  animation: pulse 2s ease-in-out infinite;
}

.spinner-particles {
  position: absolute;
  inset: -20px;
  animation: spin 10s linear infinite;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--primary);
  border-radius: 50%;
  animation: particle-fade 2s ease-in-out infinite;
}

.particle:nth-child(1) { top: 0; left: 50%; animation-delay: 0s; }
.particle:nth-child(2) { top: 25%; right: 0; animation-delay: 0.25s; }
.particle:nth-child(3) { bottom: 0; left: 50%; animation-delay: 0.5s; }
.particle:nth-child(4) { top: 25%; left: 0; animation-delay: 0.75s; }
.particle:nth-child(5) { top: 15%; left: 15%; animation-delay: 1s; }
.particle:nth-child(6) { bottom: 15%; right: 15%; animation-delay: 1.25s; }
.particle:nth-child(7) { bottom: 15%; left: 15%; animation-delay: 1.5s; }
.particle:nth-child(8) { top: 15%; right: 15%; animation-delay: 1.75s; }

.loading-text {
  color: white;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dots {
  display: flex;
  gap: 0.25rem;
}

.dot {
  width: 4px;
  height: 4px;
  background: var(--primary);
  border-radius: 50%;
  animation: dot-fade 1.4s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.1);
  }
}

@keyframes particle-fade {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 0.8;
    transform: scale(1);
  }
}

@keyframes dot-fade {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.3s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}
</style>