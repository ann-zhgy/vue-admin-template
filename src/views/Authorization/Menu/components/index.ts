import { AdminDialogType } from '@/constants'
import MenuDetail from './src/MenuDetail.vue'
import { MenuInfo } from '@/api/authorization/menu/types'

export interface MenuDetailInfo extends MenuInfo {
  functionGroupNos: string[]
}

export interface MenuDetailAction {
  init: (dialogType: AdminDialogType, menuId?: number) => void
  getValue: () => MenuDetailInfo
}

export { MenuDetail }
