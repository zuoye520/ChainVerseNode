<template>
    <div class="domains-grid">
      <div v-for="domain in domains" :key="domain.name" class="domain-card">
        <div class="domain-info">
          <div class="domain-main">
            <h3>{{ domain.name }}</h3>
            <div class="domain-tags">
              <span v-if="domain.isPrimary" class="tag primary">
                <StarIcon class="tag-icon" />
                Primary
              </span>
              <span 
                class="tag rewards"
                :class="{ active: domain.rewardsActive }"
              >
                <BoltIcon class="tag-icon" />
                {{ domain.rewardsActive ? 'Rewards Active' : 'Rewards Inactive' }}
              </span>
              <span class="tag permanent">
                <ClockIcon class="tag-icon" />
                Permanent
              </span>
            </div>
          </div>
          <div class="actions-menu" v-show="!domain.rewardsActive" v-click-outside="closeAllActions">
            <button class="action-dots" @click="toggleActions(domain)">
              <EllipsisVerticalIcon class="dots-icon" />
            </button>
            <div v-if="domain.showActions" class="actions-popup">
              <!-- <button class="action-item" @click="transferDomain(domain)">
                <ArrowRightIcon class="action-icon" />
                Transfer
              </button>
              <button 
                v-if="!domain.isPrimary"
                class="action-item" 
                @click="setPrimaryIdentity(domain)"
              >
                <StarIcon class="action-icon" />
                Set as primary
              </button> -->
              <button 
                v-if="!domain.rewardsActive"
                class="action-item"
                :class="{ active: domain.rewardsActive }"
                @click="toggleRewards(domain)"
              >
                <BoltIcon class="action-icon" />
                {{ domain.rewardsActive ? 'Deactivate Rewards' : 'Activate Rewards' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { 
    StarIcon,
    BoltIcon,
    ClockIcon,
    ArrowRightIcon,
    EllipsisVerticalIcon
  } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    domains: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['transfer', 'set-primary', 'toggle-rewards'])
  
  const toggleActions = (domain) => {
    props.domains.forEach(d => {
      if (d.name !== domain.name) {
        d.showActions = false
      }
    })
    domain.showActions = !domain.showActions
  }
  
  const closeAllActions = () => {
    props.domains.forEach(domain => {
      domain.showActions = false
    })
  }
  
  const transferDomain = (domain) => {
    emit('transfer', domain)
    closeAllActions()
  }
  
  const setPrimaryIdentity = (domain) => {
    emit('set-primary', domain)
    closeAllActions()
  }
  
  const toggleRewards = (domain) => {
    emit('toggle-rewards', domain)
    closeAllActions()
  }
  </script>
  
  <style scoped>
  .domains-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
  
  .domain-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s;
  }
  
  .domain-card:hover {
    transform: translateY(-2px);
    border-color: var(--primary);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .domain-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .domain-main {
    flex: 1;
  }
  
  .domain-main h3 {
    color: var(--primary);
    font-size: 1.25rem;
    margin-bottom: 1rem;
    word-break: break-all;
  }
  
  .domain-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .tag-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
  
  .tag.primary {
    background: rgba(0, 194, 255, 0.1);
    color: var(--primary);
    border-color: rgba(0, 194, 255, 0.2);
  }
  
  .tag.rewards {
    background: rgba(255, 77, 77, 0.1);
    color: #ff4d4d;
    border-color: rgba(255, 77, 77, 0.2);
  }
  
  .tag.rewards.active {
    background: rgba(0, 194, 255, 0.1);
    color: var(--primary);
    border-color: rgba(0, 194, 255, 0.2);
  }
  
  .tag.permanent {
    background: rgba(255, 255, 255, 0.05);
    color: var(--primary);
    border-color: rgba(0, 194, 255, 0.2);
  }
  
  .actions-menu {
    position: relative;
  }
  
  .action-dots {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    border-radius: 6px;
    transition: all 0.2s;
  }
  
  .action-dots:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .dots-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .actions-popup {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: rgba(10, 14, 23, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    min-width: 200px;
    overflow: hidden;
    z-index: 10;
    animation: slideDown 0.2s ease-out;
  }
  
  .action-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    color: var(--text);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  
  .action-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
  
  .action-item.active {
    color: var(--primary);
  }
  
  .action-icon {
    width: 1rem;
    height: 1rem;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .domains-grid {
      grid-template-columns: 1fr;
    }
  
    .domain-card {
      padding: 1.25rem;
    }
  
    .domain-tags {
      flex-wrap: wrap;
    }
  }
  </style>