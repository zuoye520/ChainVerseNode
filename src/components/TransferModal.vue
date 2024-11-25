<template>
    <Modal
      :show="show"
      title="Transfer Name"
      size="small"
      @close="handleClose"
    >
      <div class="transfer-modal">
        <div class="domain-info">
          <h4>Domain Name</h4>
          <div class="domain-name">{{ domain?.name }}</div>
        </div>
  
        <div class="input-group">
          <label>Recipient Address</label>
          <div class="input-wrapper">
            <input
              v-model="recipientAddress"
              type="text"
              class="cyber-input"
              placeholder="Enter NULS address"
              :class="{ 'error': showError }"
            />
            <div v-if="showError" class="error-message">
              Please enter a valid NULS address
            </div>
          </div>
        </div>
  
        <div class="warning-message">
          <ExclamationTriangleIcon class="warning-icon" />
          <p>This action cannot be undone. The domain will be transferred permanently.</p>
        </div>
      </div>
  
      <template #footer>
        <div class="modal-footer">
          <button 
            class="cyber-button secondary" 
            @click="handleClose"
          >
            Cancel
          </button>
          <button 
            class="cyber-button primary" 
            @click="handleTransfer"
            :disabled="!isValidAddress || isLoading"
          >
            <span v-if="isLoading">
              <ArrowPathIcon class="spin-icon" />
              Transferring...
            </span>
            <span v-else>
              <ArrowRightIcon class="btn-icon" />
              Transfer
            </span>
          </button>
        </div>
      </template>
    </Modal>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { 
    ArrowRightIcon, 
    ExclamationTriangleIcon,
    ArrowPathIcon 
  } from '@heroicons/vue/24/outline'
  import Modal from './Modal.vue'
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    domain: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['update:show', 'transfer'])
  
  const recipientAddress = ref('')
  const showError = ref(false)
  const isLoading = ref(false)
  
  const isValidAddress = computed(() => {
    // Add NULS address validation logic here
    return recipientAddress.value.length > 0 && 
           (recipientAddress.value.startsWith('NULS') || 
            recipientAddress.value.startsWith('tNULS') ||
            recipientAddress.value.endsWith('.nuls')) 
            
  })
  
  watch(recipientAddress, () => {
    showError.value = false
  })
  
  const handleClose = () => {
    emit('update:show', false)
    recipientAddress.value = ''
    showError.value = false
    isLoading.value = false
  }
  
  const handleTransfer = async () => {
    if (!isValidAddress.value) {
      showError.value = true
      return
    }
  
    try {
      isLoading.value = true
      await emit('transfer', {
        domain: props.domain,
        recipient: recipientAddress.value
      })
      handleClose()
    } catch (error) {
      console.error('Transfer failed:', error)
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .transfer-modal {
    padding: 0.5rem;
  }
  
  .domain-info {
    margin-bottom: 1.5rem;
  }
  
  .domain-info h4 {
    color: var(--text);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .domain-name {
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
    word-break: break-all;
  }
  
  .input-group {
    margin-bottom: 1.5rem;
  }
  
  .input-group label {
    display: block;
    color: var(--text);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .cyber-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 0.95rem;
    transition: all 0.3s;
  }
  
  .cyber-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 228, 134, 0.2);
  }
  
  .cyber-input.error {
    border-color: #ff4d4d;
  }
  
  .error-message {
    position: absolute;
    color: #ff4d4d;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  
  .warning-message {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(255, 152, 0, 0.1);
    border: 1px solid rgba(255, 152, 0, 0.2);
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .warning-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #ff9800;
    flex-shrink: 0;
  }
  
  .warning-message p {
    color: var(--text);
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .cyber-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.95rem;
  }
  
  .cyber-button.secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text);
  }
  
  .cyber-button.primary {
    background: var(--primary);
    color: white;
    border: none;
  }
  
  .cyber-button:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  
  .cyber-button.secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--primary);
  }
  
  .cyber-button.primary:hover:not(:disabled) {
    background: var(--primary-dark);
    box-shadow: 0 4px 12px rgba(0, 228, 134, 0.2);
  }
  
  .cyber-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  .btn-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .spin-icon {
    width: 1.25rem;
    height: 1.25rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 768px) {
    .modal-footer {
      flex-direction: column;
    }
  
    .cyber-button {
      width: 100%;
      justify-content: center;
    }
  }
  </style>