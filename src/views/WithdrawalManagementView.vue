<template>
  <div class="withdrawal-management">
    <div class="container">
      <h1>Withdrawal Management</h1>
      
      <div class="filter-tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'all' }"
          @click="setActiveTab('all')"
        >
          All
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'pending' }"
          @click="setActiveTab('pending')"
        >
          Pending
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'complete' }"
          @click="setActiveTab('complete')"
        >
          Complete
        </button>
      </div>
      
      <div class="withdrawal-table-container">
        <table class="withdrawal-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Creation Time</th>
              <th>Update Time</th>
              <th>Hash</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredWithdrawals.length === 0">
              <td colspan="7" class="empty-table">No withdrawal records found</td>
            </tr>
            <tr v-for="(withdrawal, index) in filteredWithdrawals" :key="index">
              <td class="user-cell">
                <div class="user-address">{{ shortenAddress(withdrawal.user) }}</div>
              </td>
              <td class="amount-cell">
                <div class="amount">{{ withdrawal.amount }} {{ withdrawal.currency }}</div>
              </td>
              <td>{{ formatDate(withdrawal.creationTime) }}</td>
              <td>{{ formatDate(withdrawal.updateTime) }}</td>
              <td class="hash-cell">
                <a 
                  :href="getExplorerUrl(withdrawal.hash)" 
                  target="_blank" 
                  class="hash-link"
                >
                  {{ shortenHash(withdrawal.hash) }}
                </a>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(withdrawal.status)">
                  {{ withdrawal.status }}
                </span>
              </td>
              <td class="action-cell">
                <button 
                  v-if="withdrawal.status === 'Pending'"
                  class="action-button approve"
                  @click="approveWithdrawal(withdrawal)"
                >
                  Approve
                </button>
                <button 
                  v-if="withdrawal.status === 'Pending'"
                  class="action-button reject"
                  @click="rejectWithdrawal(withdrawal)"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <Pagination
        v-if="totalWithdrawals > pageSize"
        v-model:currentPage="currentPage"
        :pageSize="pageSize"
        :total="totalWithdrawals"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import Pagination from '../components/Pagination.vue';
import { useWalletStore } from '../stores/wallet';

const walletStore = useWalletStore();
const toast = inject('toast');
const loading = inject('loading');

// State
const withdrawals = ref([
  {
    id: '1',
    user: 'tNULSeBaMoodYW7AqyJrgYdWiJ6nfwfVHHHyXm',
    amount: '3.71282792',
    currency: 'NULS',
    creationTime: '2025/2/25 14:43:36',
    updateTime: '2025/2/25 14:43:36',
    hash: '1c7397b8a9e5d4e6f8a9c0b2d4e6f8a9c0b2d4e6f8a9c0b2d4e6f8a9c0b2d7ffb',
    status: 'Complete'
  },
  {
    id: '2',
    user: 'tNULSeBaMnrs6JKrCy6TQdzYJZkMZJDng7QAsD',
    amount: '0.91625',
    currency: 'NULS',
    creationTime: '2025/2/25 09:06:47',
    updateTime: '2025/2/25 09:06:47',
    hash: '213123b8a9e5d4e6f8a9c0b2d4e6f8a9c0b2d4e6f8a9c0b2d4e6f8a9c0b2d2312',
    status: 'Complete'
  },
  {
    id: '3',
    user: 'tNULSeBaMrbMRiFAUeeAt6swb4xVBNyi81YL24',
    amount: '1.25000',
    currency: 'NULS',
    creationTime: '2025/2/26 11:22:33',
    updateTime: '2025/2/26 11:22:33',
    hash: '',
    status: 'Pending'
  }
]);

const activeTab = ref('all');
const currentPage = ref(1);
const pageSize = ref(10);
const totalWithdrawals = ref(withdrawals.value.length);

// Computed
const filteredWithdrawals = computed(() => {
  let filtered = [...withdrawals.value];
  
  if (activeTab.value === 'pending') {
    filtered = filtered.filter(w => w.status === 'Pending');
  } else if (activeTab.value === 'complete') {
    filtered = filtered.filter(w => w.status === 'Complete');
  }
  
  return filtered;
});

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab;
  currentPage.value = 1;
};

const formatDate = (dateString) => {
  return dateString;
};

const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 10)}...${address.substring(address.length - 4)}`;
};

const shortenHash = (hash) => {
  if (!hash) return '';
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

const getExplorerUrl = (hash) => {
  if (!hash) return '#';
  return `${walletStore.currentChainConfig.explorer}/transaction/info?hash=${hash}`;
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Complete':
      return 'status-complete';
    case 'Pending':
      return 'status-pending';
    case 'Rejected':
      return 'status-rejected';
    default:
      return '';
  }
};

const approveWithdrawal = async (withdrawal) => {
  try {
    loading.show('Processing withdrawal approval...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update withdrawal status
    withdrawal.status = 'Complete';
    withdrawal.updateTime = new Date().toLocaleString();
    withdrawal.hash = '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
    
    toast.show('Withdrawal approved successfully', 'success');
  } catch (error) {
    console.error('Failed to approve withdrawal:', error);
    toast.show('Failed to approve withdrawal', 'error');
  } finally {
    loading.hide();
  }
};

const rejectWithdrawal = async (withdrawal) => {
  try {
    loading.show('Processing withdrawal rejection...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update withdrawal status
    withdrawal.status = 'Rejected';
    withdrawal.updateTime = new Date().toLocaleString();
    
    toast.show('Withdrawal rejected successfully', 'success');
  } catch (error) {
    console.error('Failed to reject withdrawal:', error);
    toast.show('Failed to reject withdrawal', 'error');
  } finally {
    loading.hide();
  }
};

onMounted(() => {
  // Fetch withdrawal data
  // This would be replaced with an actual API call
});
</script>

<style scoped>
.withdrawal-management {
  padding-top: 80px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text);
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button.active {
  background: rgba(0, 194, 255, 0.1);
  border-color: var(--primary);
  color: var(--primary);
}

.tab-button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.withdrawal-table-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.withdrawal-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--text);
}

.withdrawal-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: white;
  background: rgba(10, 14, 23, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.withdrawal-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-table {
  text-align: center;
  padding: 2rem;
  color: var(--text);
}

.user-cell, .hash-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.amount-cell .amount {
  color: var(--primary);
  font-weight: 500;
}

.hash-link {
  color: var(--primary);
  text-decoration: none;
  transition: all 0.2s;
}

.hash-link:hover {
  text-decoration: underline;
  color: white;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-complete {
  background: rgba(0, 194, 255, 0.1);
  color: var(--primary);
  border: 1px solid rgba(0, 194, 255, 0.2);
}

.status-pending {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.2);
}

.status-rejected {
  background: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
  border: 1px solid rgba(255, 77, 77, 0.2);
}

.action-cell {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-button.approve {
  background: rgba(0, 194, 255, 0.1);
  color: var(--primary);
  border: 1px solid rgba(0, 194, 255, 0.2);
}

.action-button.approve:hover {
  background: rgba(0, 194, 255, 0.2);
}

.action-button.reject {
  background: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
  border: 1px solid rgba(255, 77, 77, 0.2);
}

.action-button.reject:hover {
  background: rgba(255, 77, 77, 0.2);
}

@media (max-width: 1024px) {
  .withdrawal-table {
    font-size: 0.9rem;
  }
  
  .withdrawal-table th,
  .withdrawal-table td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
  }
  
  .tab-button {
    flex: 1;
    padding: 0.75rem 1rem;
    text-align: center;
  }
  
  .withdrawal-table-container {
    overflow-x: auto;
  }
  
  .withdrawal-table {
    min-width: 800px;
  }
}
</style>