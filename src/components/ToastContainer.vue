<template>
  <div class="toast-container">
    <TransitionGroup name="toast-list">
      <component
        v-for="toast in toasts"
        :key="toast.id"
        :is="toast.component"
        v-bind="toast"
        @close="removeToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: none;
}

.toast-list-move {
  transition: all 0.3s ease;
}
</style>