<template>
  <Transition name="toast">
    <div 
      v-if="toast.show" 
      class="toast"
      :class="toastClass"
    >
      <div class="toast-content">
        <component 
          :is="toastIcon" 
          class="toast-icon"
          v-if="toastIcon"
        />
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps({
  toast: {
    type: Object,
    required: true,
    default: () => ({
      show: false,
      message: '',
      type: 'info',
      duration: 3000
    })
  }
})

const toastClass = computed(() => ({
  'toast-info': props.toast.type === 'info',
  'toast-success': props.toast.type === 'success',
  'toast-error': props.toast.type === 'error',
  'toast-warning': props.toast.type === 'warning'
}))

const toastIcon = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationCircleIcon
    case 'info':
      return InformationCircleIcon
    default:
      return null
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  z-index: 1000;
  min-width: 300px;
  max-width: 90%;
  backdrop-filter: blur(10px);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.toast-info {
  background: rgba(59, 130, 246, 0.9);
}

.toast-success {
  background: rgba(0, 228, 134, 0.9);
}

.toast-error {
  background: rgba(220, 53, 69, 0.9);
}

.toast-warning {
  background: rgba(255, 152, 0, 0.9);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 1rem);
}
</style>