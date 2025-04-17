import { AdminDialogType } from '@/constants'
import FunctionDetail from './src/FunctionDetail.vue'
import { FunctionInfo } from '@/api/authorization/function/types'

export interface FunctionDetailAction {
  init: (dialogType: AdminDialogType, functionId?: number) => void
  getValue: () => FunctionInfo
}

export { FunctionDetail }
