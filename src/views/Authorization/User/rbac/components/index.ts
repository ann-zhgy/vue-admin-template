import { AdminDialogType } from '@/constants'
import UserDetail from './src/UserDetail.vue'
import { RBACModelUserInfo } from '@/api/authorization/login/types'

export type UserDetailAction = {
  init: (userId: number, dialogType: AdminDialogType) => void
  getValue: () => RBACModelUserInfo
}

export { UserDetail }
