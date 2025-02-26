<template>
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="$emit('update:currentPage', currentPage - 1)"
      >
        <ChevronLeftIcon class="icon" />
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in displayedPages" 
          :key="page"
          class="page-number"
          :class="{ active: page === currentPage }"
          @click="$emit('update:currentPage', page)"
        >
          {{ page }}
        </button>
      </div>
  
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="$emit('update:currentPage', currentPage + 1)"
      >
        <ChevronRightIcon class="icon" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
  
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:currentPage'])

// 计算总页数
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

// 计算当前页显示的起始和结束项
const startItem = computed(() => ((props.currentPage - 1) * props.pageSize) + 1)
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.total))

// 计算要显示的页码
const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 7 // 最多显示的页码数
  
  if (totalPages.value <= maxDisplayed) {
    // 如果总页数小于等于最大显示数，显示所有页码
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // 始终显示第一页
    pages.push(1)
    
    // 计算中间要显示的页码
    let start = Math.max(2, props.currentPage - 2)
    let end = Math.min(totalPages.value - 1, props.currentPage + 2)
    
    // 如果当前页靠近开始
    if (props.currentPage < 4) {
      end = 5
    }
    
    // 如果当前页靠近结束
    if (props.currentPage > totalPages.value - 3) {
      start = totalPages.value - 4
    }
    
    // 添加省略号和中间页码
    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (end < totalPages.value - 1) pages.push('...')
    
    // 始终显示最后一页
    pages.push(totalPages.value)
  }
  
  return pages
})

// 页码改变处理函数
const onPageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
  }
  
  .page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .page-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--primary);
    color: var(--primary);
  }
  
  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .page-numbers {
    display: flex;
    gap: 0.5rem;
  }
  
  .page-number {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .page-number:hover:not(.active) {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--primary);
    color: var(--primary);
  }
  
  .page-number.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
    cursor: default;
  }
  
  @media (max-width: 480px) {
    .page-numbers {
      gap: 0.25rem;
    }
  
    .page-btn,
    .page-number {
      width: 32px;
      height: 32px;
    }
  
    .icon {
      width: 1rem;
      height: 1rem;
    }
  }
  </style>