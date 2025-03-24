<template>
  <div class="rewards-stats tdc-rewards">
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon">
          <SparklesIcon class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Rewards</div>
          <div class="stat-value">{{ totalRewards }} TDC</div>
          <!-- <div class="stat-usd">≈ {{ totalRewardsUsd }}</div> -->
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">
          <BanknotesIcon class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">Unclaimed Rewards</div>
          <div class="stat-value">{{ unclaimedRewards }} TDC</div>
          <!-- <div class="stat-usd">≈ {{ unclaimedRewardsUsd }}</div> -->
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">
          <CurrencyDollarIcon class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">APR</div>
          <div class="stat-value">{{ apr }}%</div>
          <div class="stat-usd">Annual Percentage Rate</div>
        </div>
      </div>
    </div>

    <div class="staking-section">
      <div class="staking-info">
        <div class="info-item">
          <span class="label">Total Staked:</span>
          <span class="value">{{ stakedAmount }} TDC</span>
        </div>
        <div class="info-item">
          <span class="label">Available Balance:</span>
          <span class="value">{{ availableBalance }} TDC</span>
        </div>
      </div>

      <div class="staking-actions">
        <button 
          v-if="!delegate"
          class="cyber-button primary" 
          @click="showStakeModal = true"
        >
          <LockClosedIcon class="btn-icon" />
          Stake TDC
        </button>
        <button 
          v-if="!delegate"
          class="cyber-button secondary" 
          @click="showUnstakeModal = true"
          :disabled="stakedAmount <= 0"
        >
          <LockOpenIcon class="btn-icon" />
          Unstake TDC
        </button>
        <button 
          class="cyber-button accent claim-all" 
          @click="claimRewards"
          :disabled="!hasUnclaimedRewards"
        >
          <SparklesIcon class="btn-icon" />
          Claim Rewards
        </button>
      </div>
    </div>

    <!-- Stake Modal -->
    <Modal
      title="Stake TDC"
      size="small"
      :show="showStakeModal"
      @close="showStakeModal = false"
    >
      <div class="stake-modal-content">
        <div class="balance-info">
          Available: {{ availableBalance }} TDC
        </div>
        <div class="input-group">
          <input 
            type="number" 
            v-model="stakeAmount" 
            class="cyber-input"
            placeholder="Enter amount to stake"
            :max="availableBalance"
            min="0"
            step="0.000001"
          >
          <button class="max-btn" @click="stakeAmount = availableBalance">MAX</button>
        </div>
        <div class="modal-footer">
          <button class="cyber-button secondary" @click="showStakeModal = false">
            Cancel
          </button>
          <button 
            class="cyber-button primary" 
            @click="handleStake"
            :disabled="!isValidStakeAmount"
          >
            Confirm Stake
          </button>
        </div>
      </div>
    </Modal>

    <!-- Unstake Modal -->
    <Modal
      :show="showUnstakeModal"
      title="Unstake TDC"
      size="small"
      @close="showUnstakeModal = false"
    >
      <div class="stake-modal-content">
        <div class="balance-info">
          Staked: {{ stakedAmount }} TDC
        </div>
        <div class="input-group">
          <input 
            type="number" 
            v-model="unstakeAmount" 
            class="cyber-input"
            placeholder="Enter amount to unstake"
            :max="stakedAmount"
            min="0"
            step="0.000001"
          >
          <button class="max-btn" @click="unstakeAmount = stakedAmount">MAX</button>
        </div>
        <div class="modal-footer">
          <button class="cyber-button secondary" @click="showUnstakeModal = false">
            Cancel
          </button>
          <button 
            class="cyber-button primary" 
            @click="handleUnstake"
            :disabled="!isValidUnstakeAmount"
          >
            Confirm Unstake
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { 
  SparklesIcon, 
  BanknotesIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/vue/24/outline'
import Modal from './Modal.vue'

const toast = inject('toast')
const loading = inject('loading')

const props = defineProps({
  delegate:{
    type: Boolean,
    default: false
  },
  apr:{
    type: String,
    default: '0'
  },
  stakedAmount:{
    type: String,
    default: '0'
  },
  availableBalance:{
    type: String,
    default: '0'
  },
  totalRewards: {
    type: String,
    default: '0'
  },
  totalRewardsUsd: {
    type: String,
    default: '0'
  },
  unclaimedRewards: {
    type: String,
    default: '0'
  },
  unclaimedRewardsUsd: {
    type: String,
    default: '0'
  }
})

const emit = defineEmits(['claim-rewards', 'stake', 'unstake'])

// Staking state
// const apr = ref(12.5) // APR percentage
const newStakedAmount = ref(0)
// const availableBalance = ref(1000)
const showStakeModal = ref(false)
const showUnstakeModal = ref(false)
const stakeAmount = ref('')
const unstakeAmount = ref('')

const hasUnclaimedRewards = computed(() => parseFloat(props.unclaimedRewards) > 0)

const isValidStakeAmount = computed(() => {
  const amount = parseFloat(stakeAmount.value)
  return amount > 0 && amount <= props.availableBalance
})

const isValidUnstakeAmount = computed(() => {
  const amount = parseFloat(unstakeAmount.value)
  return amount > 0 && amount <= props.stakedAmount
})

const handleStake = async () => {
  if (!isValidStakeAmount.value) return

  try {
    loading.show('Staking TDC...')
    await emit('stake', parseFloat(stakeAmount.value))
    showStakeModal.value = false
    stakeAmount.value = ''
    // toast.show('Successfully staked TDC', 'success')
  } catch (error) {
    console.error('Staking failed:', error)
    toast.show('Failed to stake TDC', 'error')
  } finally {
    loading.hide()
  }
}

const handleUnstake = async () => {
  if (!isValidUnstakeAmount.value) return

  try {
    loading.show('Unstaking TDC...')
    await emit('unstake', parseFloat(unstakeAmount.value))
    showUnstakeModal.value = false
    unstakeAmount.value = ''
    toast.show('Successfully unstaked TDC', 'success')
  } catch (error) {
    console.error('Unstaking failed:', error)
    toast.show('Failed to unstake TDC', 'error')
  } finally {
    loading.hide()
  }
}

const claimRewards = () => {
  emit('claim-rewards')
}
</script>

<style scoped>
.rewards-stats {
  margin-bottom: 2rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.tdc-rewards {
  border: 1px solid var(--accent-color);
  background: linear-gradient(to right, rgba(255, 94, 58, 0.05), rgba(255, 58, 107, 0.05));
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 94, 58, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .icon {
  width: 24px;
  height: 24px;
  color: var(--accent-color);
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: var(--text);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-usd {
  color: var(--text);
  font-size: 0.9rem;
}

.staking-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
}

.staking-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  color: var(--text);
  font-size: 0.9rem;
}

.info-item .value {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
}

.staking-actions {
  display: flex;
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
  text-decoration: none;
  font-size: 0.95rem;
  flex: 1;
  justify-content: center;
}

.cyber-button.primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
}

.cyber-button.secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text);
}

.cyber-button.accent {
  background: var(--gradient-accent);
  color: white;
  border: none;
}

.cyber-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.cyber-button.primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(0, 194, 255, 0.3);
}

.cyber-button.accent:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(255, 94, 58, 0.3);
}

.cyber-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* Modal Styles */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


.stake-modal-content {
  padding: 1.5rem;
}

.balance-info {
  color: var(--text);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.cyber-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.cyber-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(0, 194, 255, 0.2);
}

.max-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.max-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-footer {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-footer .cyber-button {
  flex: 1;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .staking-actions {
    flex-direction: column;
  }

  .cyber-button {
    width: 100%;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>