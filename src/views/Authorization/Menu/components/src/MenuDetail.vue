<template>
  <el-form
    :model="menuDetailItem"
    ref="formRef"
    :rules="rules"
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item
      v-if="dialogTypeRef !== AdminDialogType.ADD"
      prop="no"
      :label="t('views.authorManage.menu.no')"
    >
      <el-input v-model="menuDetailItem.no" disabled />
    </el-form-item>
    <el-form-item prop="title" :label="t('views.authorManage.menu.title')">
      <el-input v-model="menuDetailItem.title" :readonly="dialogTypeRef === AdminDialogType.VIEW" />
    </el-form-item>
    <el-form-item prop="componentKey" :label="t('views.authorManage.menu.componentKey')">
      <el-input
        v-model="menuDetailItem.componentKey"
        :readonly="dialogTypeRef === AdminDialogType.VIEW"
      />
    </el-form-item>
    <el-form-item prop="icon" :label="t('views.authorManage.menu.pageType')">
      <el-select
        v-model="menuDetailItem.staticPage"
        :disabled="dialogTypeRef === AdminDialogType.VIEW"
      >
        <el-option
          :key="true"
          :label="t('views.authorManage.menu.pageTypeDesc.static')"
          :value="true"
        />
        <el-option
          :key="false"
          :label="t('views.authorManage.menu.pageTypeDesc.dynamic')"
          :value="false"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="appKey" :label="t('views.authorManage.menu.appKey')">
      <el-tag v-if="dialogTypeRef !== AdminDialogType.ADD">
        {{ menuDetailItem.appInfo?.appName }}
      </el-tag>
      <scroll-remote-seletor
        v-else
        v-model="menuDetailItem.appKey"
        :remote-method="(param) => queryAppInfoListApi({ appKey: param.keyword, ...param })"
        option-key="appKey"
        option-label="appName"
        option-value="appKey"
      />
    </el-form-item>
    <el-form-item prop="parentNo" :label="t('views.authorManage.menu.parentNo')">
      <scroll-remote-seletor
        clearable
        v-model="menuDetailItem.parentNo"
        :disabled="dialogTypeRef === AdminDialogType.VIEW"
        :init-option-items="parentMenus"
        :remote-method="(param) =>menuDetailItem.appKey ? queryMenuListApi({ title: param.keyword,notLeafNode: true,appKey: menuDetailItem.appKey, status: CommonStatus.ENABLE, ...param }) : ({} as PageResult<JsonObject>)"
        option-key="no"
        option-label="title"
        option-value="no"
        :option-disabled="(item) => item.no === menuDetailItem.no"
      />
    </el-form-item>
    <el-form-item
      v-if="dialogTypeRef !== AdminDialogType.ADD"
      prop="functionGroupNos"
      :label="t('views.authorManage.menu.functionGroup')"
    >
      <el-tag
        type="info"
        v-for="item in menuDetailItem.functionGroupInfos"
        :key="item.no"
        style="margin-right: 4px"
      >
        {{ item.title }}
      </el-tag>
    </el-form-item>
  </el-form>
</template>
<script lang="tsx" setup>
import { queryAppInfoListApi } from '@/api/authorization/appInfo'
import { menuIsLeafApi, queryMenuApi, queryMenuListApi } from '@/api/authorization/menu'
import { MenuInfo } from '@/api/authorization/menu/types'
import { CommonStatus, PageResult } from '@/axios/types'
import { ScrollRemoteSeletor } from '@/components/ScrollRemoteSeletor'
import { AdminDialogType } from '@/constants'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag, FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'
import { MenuDetailInfo } from '..'

defineOptions({
  name: 'MenuDetail'
})

const { t } = useI18n()
const menuDetailItem = ref<MenuDetailInfo>({} as MenuDetailInfo)
const dialogTypeRef = ref<AdminDialogType>()
const formRef = ref<FormInstance>()
const rules: FormRules = {
  title: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  componentKey: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  appKey: [{ required: true, message: t('validator.required'), trigger: 'blur' }]
}
const parentMenus = ref<MenuInfo[]>()
const isLeaf = ref(true)
const init = async (dialogType: AdminDialogType, menuId?: number) => {
  dialogTypeRef.value = dialogType
  if (dialogType === AdminDialogType.ADD || !menuId) {
    menuDetailItem.value = { staticPage: false } as MenuDetailInfo
    return
  }
  const menuInfo = await queryMenuApi(menuId)
  menuDetailItem.value = {
    ...menuInfo,
    functionGroupNos: menuInfo.functionGroupInfos?.map((item) => item.no) || []
  }
  if (menuDetailItem.value.parentNo) {
    parentMenus.value = (
      await queryMenuListApi({ no: menuDetailItem.value.parentNo, pageNo: 1, pageSize: 10 })
    ).items
  }
  isLeaf.value = await menuIsLeafApi(menuInfo.id)
}
const getValue = () => {
  formRef.value!.validateField()
  return menuDetailItem.value
}
defineExpose({ init, getValue })
</script>
