<template>
    <div class="referral">
      <div class="container">
        <div class="referral-content">
          <h1>Refer Friends</h1>
          <p class="description">
            When your friends register AI identity, you will get rewards. <br>
            The inviter will share <span class="highlight">50%</span> of the platform revenue as a reward.
          </p>
  
          <div class="referral-link-section">
            <h2>Your Referral Link</h2>
            <div class="link-input">
              <input 
                type="text" 
                :value="referStore.referralLink" 
                readonly 
                class="cyber-input"
              >
              <button class="copy-btn" @click="copyLink">
                <DocumentDuplicateIcon class="icon" />
              </button>
            </div>
          </div>
  
          <div class="stats-grid">
            <div class="stat-card unclaimed">
              <div class="stat-header">
                <h3>Unclaimed rewards</h3>
                <p class="subtitle">(Minimum withdrawal amount: 100 NULS, Withdrawal fee: 1%)</p>
              </div>
              <div class="stat-value">
                <span class="amount">{{ referStore.stats.inviteRewardPending }}</span>
                <span class="currency">NULS</span>
              </div>
              <button 
                class="withdraw-btn" 
                v-if="store.account"
                :disabled="referStore.stats.inviteRewardPending <= 0"
                @click="handleWithdraw"
              >
                Withdraw
              </button>
            </div>
  
            <div class="stat-card">
              <h3>Total Referrals</h3>
              <div class="stat-value">{{ referStore.stats.totalReferrals }}</div>
            </div>
  
            <div class="stat-card">
              <h3>Total Earnings</h3>
              <div class="stat-value">
                <span class="amount">{{ referStore.stats.totalEarnings }}</span>
                <span class="currency">NULS</span>
              </div>
            </div>
          </div>
  
          <div class="history-section">
            <h2>Referral History</h2>
            <div class="history-list">
              <div v-if="referStore.referralHistoryTotal === 0" class="empty-history">
                No referral history yet
              </div>
              <div v-else v-for="(referral, index) in referStore.referralHistory" :key="index"  class="history-item">
                <div class="history-info">
                  <div class="address" @click="copyAddress(referral.user)">{{ $format.shortenAddress(referral.user)}}</div>
                  <div class="date">{{ $format.formatDate(referral.date)  }}</div>
                  <div class="status" v-show="referral.withdrawState != 'Unwithdrawn'">Withdrawal Status: {{referral.withdrawState }}</div>
                </div>
                <div class="history-amount" :class="{ positive: referral.reward > 0 }">
                  {{ referral.reward > 0 ? '+' : '' }}{{ referral.reward }} NULS
                </div>
              </div>
            </div>
            
            <Pagination
              v-model:currentPage="currentPage"
              :pageSize="pageSize"
              :total="referStore.referralHistoryTotal"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  
  import { ref, watch,inject, computed,onMounted,onBeforeMount,getCurrentInstance } from 'vue'
  import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
  import { storeToRefs } from 'pinia'
  import Pagination from '../components/Pagination.vue'

  import { useWalletStore } from '../stores/wallet'
const store = useWalletStore()
import { useReferStore } from '../stores/refer'
const referStore = useReferStore()
const { account, currentChainConfig } = storeToRefs(store)
  const toast = inject('toast')
  
  // Pagination
  const currentPage = ref(1)
  const pageSize = ref(20)
  

  // 监听页码变化
watch(account, (newAccount) => {
  console.log('account:',account.value,newAccount)
  // 加载新页数据
  if(newAccount) initData()
  
})
// 监听页码变化
watch(currentPage, (newPage) => {
  console.log('newPage:',newPage)
  // 加载新页数据
  initData(newPage)
})

  const copyLink = ()=>{
    referStore.copyReferralLink()
    toast.show('Copy Success', 'success')
  }
  const copyAddress = (address)=>{
    referStore.copyAddress(address)
    toast.show('Copy Success', 'success')
  }
  
  const handleWithdraw = async () => {
  try {
    const result = await referStore.withdraw(account.value)
    console.log('result:',result)
    toast.show('Withdrawing rewards', 'success')
  } catch (error) {
    toast.show(error.msg || error, 'error')
  }
  initData()
}

  const initData = async ()=>{
    console.log('account',account)
    if(account.value){
      await referStore.getReferInfo({
        address:account.value
      })
      await referStore.getHistoryRefers({
        address:account.value,
        pageNum:currentPage.value,
        pageSize:pageSize.value
      })
    }
  }
  onMounted(() => {
    initData()
  })
  </script>
  
  <style scoped>
  .referral {
    padding-top: 80px;
    min-height: 100vh;
    background: var(--bg-dark);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .referral-content {
    padding: 2rem 0;
  }
  
  h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .description {
    color: var(--text);
    font-size: 1.2rem;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 3rem;
  }
  
  .highlight {
    color: var(--primary);
    font-weight: 600;
  }
  
  .referral-link-section {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  h2 {
    color: white;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .link-input {
    display: flex;
    gap: 0.5rem;
  }
  
  .cyber-input {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }
  
  .copy-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text);
    width: 42px;
    height: 42px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .copy-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--primary);
    color: var(--primary);
  }
  
  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .stat-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
  }
  
  .stat-card.unclaimed {
    background: linear-gradient(135deg, rgba(0, 228, 134, 0.1), rgba(0, 228, 134, 0.05));
    border-color: rgba(0, 228, 134, 0.2);
  }
  
  .stat-header {
    margin-bottom: 1rem;
  }
  
  .stat-card h3 {
    color: white;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  .subtitle {
    color: var(--text);
    font-size: 0.8rem;
  }
  
  .stat-value {
    color: white;
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .amount {
    color: var(--primary);
  }
  
  .currency {
    color: var(--text);
    font-size: 1rem;
    margin-left: 0.5rem;
  }
  
  .withdraw-btn {
    width: 100%;
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .withdraw-btn:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  .withdraw-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .history-section {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
  }
  
  .history-list {
    margin-top: 1rem;
  }
  
  .empty-history {
    color: var(--text);
    text-align: center;
    padding: 2rem;
  }
  
  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .history-item:last-child {
    border-bottom: none;
  }
  
  .history-info {
    flex: 1;
  }
  
  .address {
    color: white;
    font-weight: 500;
    margin-bottom: 0.25rem;
    cursor: pointer;
  }
  
  .date, .status {
    color: var(--text);
    font-size: 0.9rem;
  }
  
  .history-amount {
    color: var(--text);
    font-weight: 600;
  }
  
  .history-amount.positive {
    color: var(--primary);
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
  
    h1 {
      font-size: 2rem;
    }
  
    .description {
      font-size: 1rem;
    }
  
    .stats-grid {
      grid-template-columns: 1fr;
    }
  
    .history-item {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  
    .history-amount {
      font-size: 1.25rem;
    }
  }
  </style>