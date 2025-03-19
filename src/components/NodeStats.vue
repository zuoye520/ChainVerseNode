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
            <p class="plus">+</p>
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
            <p class="plus">+</p>
            {{ dailyRewards.tdc }} <span class="currency">TDC</span>
          </div>
          <div class="stats-label">Daily Rewards</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted,getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { ServerIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { useWalletStore } from '../stores/wallet'
const walletStore = useWalletStore()

// 获取全局配置
const { proxy } = getCurrentInstance()
const currentChainConfig = proxy.$config.CURRENT_NETWORK
const chainId = proxy.$config.CHAIN_ID
// These would be replaced with actual API calls in production
const totalNodes = ref('0')
const totalRewards = ref({
  nuls: '0',
  tdc: '0'
})
const dailyRewards = ref({
  nuls: '0',
  tdc: '0'
})

onMounted(() => {
  // Here you would fetch the actual stats from your API
  fetchNodeStats()
})

const fetchNodeStats =async () =>{
  
  //查询节点数量
  const {totalCount} = await walletStore.api.pcInvokeView('getContractToken721s',[chainId,1,1,currentChainConfig.nrc721Address.tdc])
  totalNodes.value = totalCount
  //console.log('totalNodes:',totalNodes.value)
  //nuls总奖励
  const resTotalRewards = await walletStore.api.rpcInvokeView('invokeView',[chainId, currentChainConfig.contracts.stakeAddress, "ownerTotalConsensusAward", null, []])
  const nulsTotalRewards = resTotalRewards.result
  //console.log('nulsTotalRewards:',nulsTotalRewards)
  //查询合约区块高度
  const {blockHeight:createBlockHeight} = await walletStore.api.pcInvokeView('getContract',[chainId,currentChainConfig.contracts.stakeAddress])
  //console.log('721 createBlockHeight:',createBlockHeight)
  //获取当前区块高度
  const currentBlockHeight = await walletStore.api.rpcInvokeView('getLatestHeight',[chainId])
  //console.log('currentBlockHeight:',currentBlockHeight)
  const tdcTotalRewards = (currentBlockHeight-createBlockHeight)*8.5
  //查询NULS日奖励

  const beforeBlockHeight = currentBlockHeight - 8640 //24小时前的区块高度
  const currentNulsRewards = await walletStore.api.rpcInvokeView('invokeView',[chainId, currentChainConfig.contracts.stakeAddress, "ownerTotalConsensusAward", null, [], currentBlockHeight])
  const beforeNulsRewards = await walletStore.api.rpcInvokeView('invokeView',[chainId, currentChainConfig.contracts.stakeAddress, "ownerTotalConsensusAward", null, [], beforeBlockHeight])
  const nulsDayRewards = currentNulsRewards.result - beforeNulsRewards.result
  //console.log('beforeNulsRewards:',{beforeNulsRewards,currentNulsRewards},nulsDayRewards)

  totalRewards.value ={
    nuls: nulsTotalRewards,
    tdc: proxy.$format.formatAmount(tdcTotalRewards,0)
  }
  dailyRewards.value = {
    nuls: nulsDayRewards,
    tdc: proxy.$format.formatAmount(8640 * 8.5,0)
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