import { AdminDialogType } from '@/constants'
import AppInfoDetail from './src/AppInfoDetail.vue'
import { AppInfo } from '@/api/authorization/appInfo/types'

export interface AppInfoDetailAction {
  init: (dialogType: AdminDialogType, functionId?: number) => void
  getValue: () => AppInfo
}

export { AppInfoDetail }
