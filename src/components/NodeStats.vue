<template>
  <section class="node-stats-section">
    <div class="stats-container">
      <div class="stats-card">
        <div class="stats-icon">
          <ServerIcon class="icon" />
          <div class="pulse-effect"></div>
        </div>
        <div class="stats-content">
          <div class="stats-value">{{ totalNodes }}</div>
          <div class="stats-label">Total Nodes</div>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="stats-icon">
          <CurrencyDollarIcon class="icon" />
          <div class="pulse-effect"></div>
        </div>
        <div class="stats-content">
          <div class="stats-value">
            {{ totalRewards.nuls }} <span class="currency">NULS</span>
            <span class="plus">+</span>
            {{ totalRewards.tdc }} <span class="currency">TDC</span>
          </div>
          <div class="stats-label">Total Rewards Generated</div>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="stats-icon">
          <ChartBarIcon class="icon" />
          <div class="pulse-effect"></div>
        </div>
        <div class="stats-content">
          <div class="stats-value">
            {{ dailyRewards.nuls }} <span class="currency">NULS</span>
            <span class="plus">+</span>
            {{ dailyRewards.tdc }} <span class="currency">TDC</span>
          </div>
          <div class="stats-label">Daily Rewards</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ServerIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

// These would be replaced with actual API calls in production
const totalNodes = ref('2,458')
const totalRewards = ref({
  nuls: '1,245,678',
  tdc: '3,567,890'
})
const dailyRewards = ref({
  nuls: '5,432',
  tdc: '12,345'
})

onMounted(() => {
  // Here you would fetch the actual stats from your API
  fetchNodeStats()
})

const fetchNodeStats = async () => {
  // This would be replaced with an actual API call
  // For now, we're using static values
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Update with mock data (would be real data from API)
  totalNodes.value = '2,458'
  totalRewards.value = {
    nuls: '1,245,678',
    tdc: '3,567,890'
  }
  dailyRewards.value = {
    nuls: '5,432',
    tdc: '12,345'
  }
}
</script>

<style scoped>
.node-stats-section {
  padding: 4rem 2rem;
  background: linear-gradient(to bottom, rgba(10, 14, 23, 0.8), var(--bg-dark));
  position: relative;
  overflow: hidden;
}

.node-stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--primary), transparent);
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stats-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--x, 50%) var(--y, 50%),
    rgba(0, 194, 255, 0.1) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.stats-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 194, 255, 0.2);
}

.stats-card:hover::before {
  opacity: 1;
}

.stats-icon {
  width: 64px;
  height: 64px;
  background: rgba(0, 194, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.icon {
  width: 32px;
  height: 32px;
  color: var(--primary);
  position: relative;
  z-index: 1;
}

.pulse-effect {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border: 1px solid var(--primary);
  opacity: 0;
  transform: scale(1.2);
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}

.stats-content {
  flex: 1;
}

.stats-value {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.stats-label {
  color: var(--text);
  font-size: 1rem;
}

.currency {
  color: var(--primary);
  font-size: 1rem;
  font-weight: 600;
}

.plus {
  color: var(--text);
  margin: 0 0.5rem;
  font-size: 1.25rem;
}

@media (max-width: 1024px) {
  .stats-container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .node-stats-section {
    padding: 3rem 1rem;
  }
  
  .stats-card {
    padding: 1.5rem;
  }
  
  .stats-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .stats-card {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-icon {
    margin-bottom: 1rem;
  }
}
</style>