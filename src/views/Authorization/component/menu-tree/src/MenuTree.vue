<template>
  <el-tree-select
    v-model="checkedValues"
    :data="menuInfos"
    filterable
    collapse-tags
    collapse-tags-tooltip
    highlight-current
    accordion
    show-checkbox
    :render-after-expand="false"
    :multiple="multiple"
    node-key="no"
    :props="{
      label: 'title',
      children: 'childrenMenus'
    }"
    v-bind="$attrs"
  />
</template>
<script lang="tsx" setup>
import { queryAppKeyMenuListApi } from '@/api/authorization/menu'
import { MenuInfo } from '@/api/authorization/menu/types'
import { ElTreeSelect } from 'element-plus'
import { PropType, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array] as PropType<string[] | string>
  },
  appKey: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  showFunctionGroup: {
    type: Boolean,
    default: false
  }
})
const menuInfos = ref<MenuInfo[]>()
const emit = defineEmits(['update:modelValue'])
const queryMenuInfo = async (appKey?: string) => {
  if (!appKey) {
    menuInfos.value = []
    return
  }
  menuInfos.value = await queryAppKeyMenuListApi(appKey)
  if (props.showFunctionGroup) {
    menuInfos.value.forEach((menuInfo) => {
      setMenuFunctionGroupNodes(menuInfo)
    })
  }
}
const setMenuFunctionGroupNodes = (menuInfo: MenuInfo) => {
  if (menuInfo.childrenMenus && menuInfo.childrenMenus.length > 0) {
    menuInfo.childrenMenus.forEach((item) => {
      setMenuFunctionGroupNodes(item)
    })
  }
  if (menuInfo.functionGroupInfos && menuInfo.functionGroupInfos.length > 0) {
    menuInfo.childrenMenus = menuInfo.functionGroupInfos.map((item) => {
      return {
        no: item.no,
        title: item.title
      } as MenuInfo
    })
  }
}
const checkedValues = ref<string[] | string>()
watch(
  () => checkedValues.value,
  (val) => {
    emit('update:modelValue', val)
  }
)
watch(
  () => props.modelValue,
  (val) => {
    checkedValues.value = val
  },
  { immediate: true, deep: true }
)
watch(
  () => props.appKey,
  (val) => {
    queryMenuInfo(val)
  },
  { immediate: true, deep: true }
)
</script>
