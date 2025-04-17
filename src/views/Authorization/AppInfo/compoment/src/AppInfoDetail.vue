<template>
  <el-form
    :model="appInfo"
    ref="formRef"
    :rules="rules"
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item prop="appKey" :label="t('views.authorManage.appInfo.appKey')">
      <el-input v-model="appInfo.appKey" :disabled="dialogTypeRef !== AdminDialogType.ADD" />
    </el-form-item>
    <el-form-item prop="appName" :label="t('views.authorManage.appInfo.appName')">
      <el-input v-model="appInfo.appName" :readonly="dialogTypeRef === AdminDialogType.VIEW" />
    </el-form-item>
    <el-form-item prop="description" :label="t('views.authorManage.appInfo.description')">
      <el-input v-model="appInfo.description" :readonly="dialogTypeRef === AdminDialogType.VIEW" />
    </el-form-item>
    <el-form-item prop="accessControlBy" :label="t('views.authorManage.appInfo.accessControlBy')">
      <el-select v-model="appInfo.accessControlBy" clearable>
        <el-option
          :key="AccessControlType.BY_RBAC"
          :label="t('views.authorManage.appInfo.accessControlByDesc.byRbac')"
          :value="AccessControlType.BY_RBAC"
        />
        <el-option
          :key="AccessControlType.BY_SELF"
          :label="t('views.authorManage.appInfo.accessControlByDesc.bySelf')"
          :value="AccessControlType.BY_SELF"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      prop="grantAccessPermissionBy"
      :label="t('views.authorManage.appInfo.grantAccessPermissionBy')"
    >
      <el-select v-model="appInfo.grantAccessPermissionBy" clearable>
        <el-option
          :key="GrantAccessPermissionType.AUTO"
          :label="t('views.authorManage.appInfo.grantAccessPermissionByDesc.byAuto')"
          :value="GrantAccessPermissionType.AUTO"
        />
        <el-option
          :key="GrantAccessPermissionType.MANUAL"
          :label="t('views.authorManage.appInfo.grantAccessPermissionByDesc.byManual')"
          :value="GrantAccessPermissionType.MANUAL"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="appType" :label="t('views.authorManage.appInfo.appType')">
      <el-select v-model="appInfo.appType" clearable multiple>
        <el-option
          :key="AppType.BACKEND"
          :label="t(`views.authorManage.appInfo.appTypeDesc.${AppType.BACKEND}`)"
          :value="AppType.BACKEND"
        />
        <el-option
          :key="AppType.WEB"
          :label="t(`views.authorManage.appInfo.appTypeDesc.${AppType.WEB}`)"
          :value="AppType.WEB"
        />
        <el-option
          :key="AppType.MINI_PROGRAM"
          :label="t(`views.authorManage.appInfo.appTypeDesc.${AppType.MINI_PROGRAM}`)"
          :value="AppType.MINI_PROGRAM"
        />
        <el-option
          :key="AppType.ANDROID"
          :label="t(`views.authorManage.appInfo.appTypeDesc.${AppType.ANDROID}`)"
          :value="AppType.ANDROID"
        />
        <el-option
          :key="AppType.IOS"
          :label="t(`views.authorManage.appInfo.appTypeDesc.${AppType.IOS}`)"
          :value="AppType.IOS"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script lang="tsx" setup>
import { queryAppInfoApi } from '@/api/authorization/appInfo'
import {
  AccessControlType,
  AppInfo,
  AppType,
  GrantAccessPermissionType
} from '@/api/authorization/appInfo/types'
import { AdminDialogType } from '@/constants'
import { useI18n } from '@/hooks/web/useI18n'
import { FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'

defineOptions({
  name: 'AppInfoDetail'
})

const { t } = useI18n()
const appInfo = ref<AppInfo>({} as AppInfo)
const dialogTypeRef = ref<AdminDialogType>()
const formRef = ref<FormInstance>()
const rules: FormRules = {
  appKey: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  appName: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  accessControlBy: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  grantAccessPermissionBy: [{ required: true, message: t('validator.required'), trigger: 'blur' }]
}
const init = async (dialogType: AdminDialogType, appInfoId?: number) => {
  dialogTypeRef.value = dialogType
  if (dialogType === AdminDialogType.ADD || !appInfoId) {
    appInfo.value = {} as AppInfo
    return
  }
  appInfo.value = await queryAppInfoApi(appInfoId)
}
const getValue = () => {
  formRef.value!.validateField()
  return appInfo.value
}
defineExpose({ init, getValue })
</script>
