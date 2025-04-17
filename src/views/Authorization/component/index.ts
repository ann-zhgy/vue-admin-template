import MenuTree from './menu-tree/src/MenuTree.vue'
import UpdateItem from './update-item/src/UpdateItem.vue'

export interface UpdateItemAction {
  addedItems: () => (number | string)[]
  deletedItems: () => (number | string)[]
  finalItems: () => (number | string)[]
}

export { UpdateItem, MenuTree }
