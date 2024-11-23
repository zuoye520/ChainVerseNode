<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
      <div 
        class="modal-container"
        :class="[size, { 'no-padding': noPadding }]"
        @click.stop
      >
        <div v-if="!hideHeader" class="modal-header">
          <h3 class="modal-title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <button v-if="!hideClose" class="close-btn" @click="handleClose">
            <XMarkIcon class="close-icon" />
          </button>
        </div>

        <div class="modal-body">
          <slot></slot>
        </div>

        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>

        <div class="modal-effects">
          <div class="corner-effect top-left"></div>
          <div class="corner-effect top-right"></div>
          <div class="corner-effect bottom-left"></div>
          <div class="corner-effect bottom-right"></div>
          <div class="edge-glow"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  },
  hideClose: {
    type: Boolean,
    default: false
  },
  hideHeader: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'update:show'])

const handleClose = () => {
  emit('close')
  emit('update:show', false)
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 11, 14, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-container {
  position: relative;
  background: var(--bg-dark);
  border-radius: 16px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-container.small {
  max-width: 400px;
}

.modal-container.medium {
  max-width: 600px;
}

.modal-container.large {
  max-width: 800px;
}

.modal-container.full {
  max-width: none;
  width: calc(100% - 2rem);
  height: calc(100vh - 2rem);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s;
  border-radius: 8px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.no-padding .modal-body {
  padding: 0;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.corner-effect {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary);
  opacity: 0.5;
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.edge-glow {
  position: absolute;
  inset: 0;
  border: 1px solid var(--primary);
  opacity: 0.1;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: scale(0.9);
}

.modal-leave-to .modal-container {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-container.small,
  .modal-container.medium,
  .modal-container.large {
    max-width: none;
    width: 100%;
    height: 100%;
  }

  .modal-body {
    max-height: calc(100vh - 130px);
  }
}
</style>