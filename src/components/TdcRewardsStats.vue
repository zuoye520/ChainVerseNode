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
          <div class="stat-usd">≈ {{ totalRewardsUsd }}</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">
          <BanknotesIcon class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">Unclaimed Rewards</div>
          <div class="stat-value">{{ unclaimedRewards }} TDC</div>
          <div class="stat-usd">≈ {{ unclaimedRewardsUsd }}</div>
        </div>
      </div>

      <div class="stat-item action">
        <button 
          class="cyber-button primary claim-all" 
          @click="claimAllRewards"
          :disabled="!hasUnclaimedRewards"
        >
          <SparklesIcon class="btn-icon" />
          Claim All Rewards
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { SparklesIcon, BanknotesIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
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

const emit = defineEmits(['claim-rewards'])

const hasUnclaimedRewards = computed(() => parseFloat(props.unclaimedRewards) > 0)

const claimAllRewards = () => {
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

.stat-item.action {
  justify-content: flex-end;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.cyber-button.primary {
  background: var(--gradient-accent);
  color: white;
  border-color: transparent;
}

.cyber-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.cyber-button.primary:hover:not(:disabled) {
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

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .cyber-button {
    width: 100%;
    justify-content: center;
  }
}
</style>