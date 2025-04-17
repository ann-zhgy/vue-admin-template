import { AdminDialogType } from '@/constants'
import RoleDetail from './src/RoleDetail.vue'
import { RoleUpdateRequest } from '@/api/authorization/role/type'

export interface RoleDetailInfo extends RoleUpdateRequest {
  menuNos: string[]
}

export interface RoleDetailAction {
  init: (dialogType: AdminDialogType, roleId?: number) => void
  getValue: () => RoleUpdateRequest
}

export { RoleDetail }
