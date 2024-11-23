// 使用 Toast
import { useToast } from '../composables/useToast'

const { success, error, warning, info } = useToast()

// 显示成功提示
success('操作成功！')

// 显示错误提示
error('操作失败！')

// 使用 Loading
const { loading } = inject('loading')

// 显示加载
loading.show('正在处理...')

// 隐藏加载
loading.hide()

// 使用 Modal
<Modal
  v-model:show="showModal"
  title="标题"
  size="medium"
>
  <div>弹窗内容</div>
  
  <template #footer>
    <button @click="handleConfirm">确认</button>
    <button @click="handleCancel">取消</button>
  </template>
</Modal># nulsAi
