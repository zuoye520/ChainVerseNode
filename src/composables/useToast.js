import { ref } from 'vue'

const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 3000
})

let timeoutId = null

export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    // 如果已经有 toast，先清除定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 更新 toast 状态
    toast.value = {
      show: true,
      message,
      type,
      duration
    }

    // 设置新的定时器
    timeoutId = setTimeout(() => {
      hideToast()
    }, duration)
  }

  const hideToast = () => {
    toast.value.show = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return {
    toast,
    showToast,
    hideToast
  }
}

// 创建一个全局单例实例
export const globalToast = useToast()