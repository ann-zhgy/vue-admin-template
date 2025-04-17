import { AdminDialogType } from '@/constants'
import FunctionGroupDetail from './src/FunctionGroupDetail.vue'
import { FunctionGroupInfo } from '@/api/authorization/function/group/types'

export interface FunctionGroupDetailInfo extends FunctionGroupInfo {
  functionNos: string[]
}

export interface FunctionGroupDetailAction {
  init: (dialogType: AdminDialogType, functionGroupId?: number) => void
  getValue: () => FunctionGroupDetailInfo
}

export { FunctionGroupDetail }
