<template>
  <el-form
    ref="formRef"
    :model="roleInfo"
    label-width="auto"
    style="max-width: 600px"
    :rules="rules"
  >
    <el-form-item
      v-if="dialogTypeRef !== AdminDialogType.ADD"
      prop="no"
      :label="t('views.authorManage.role.no')"
    >
      <el-input v-model="roleInfo.no" disabled />
    </el-form-item>
    <el-form-item prop="name" :label="t('views.authorManage.role.name')">
      <el-input v-model="roleInfo.name" :readonly="dialogTypeRef === AdminDialogType.VIEW" />
    </el-form-item>
    <el-form-item prop="nameZh" :label="t('views.authorManage.role.nameZh')">
      <el-input v-model="roleInfo.nameZh" :readonly="dialogTypeRef === AdminDialogType.VIEW" />
    </el-form-item>
    <el-form-item prop="description" :label="t('views.authorManage.role.description')">
      <el-input v-model="roleInfo.description" :readonly="dialogTypeRef === AdminDialogType.VIEW" />
    </el-form-item>
    <el-form-item prop="appKey" :label="t('views.authorManage.role.appKey')">
      <el-tag v-if="dialogTypeRef !== AdminDialogType.ADD">
        {{ appInfo?.appName }}
      </el-tag>
      <scroll-remote-seletor
        v-else
        clearable
        v-model="roleInfo.appKey"
        :remote-method="(param) => queryAppInfoListApi({ appKey: param.keyword, ...param })"
        option-key="appKey"
        option-label="appName"
        option-value="appKey"
      />
    </el-form-item>
    <el-form-item prop="menuNos" :label="t('views.authorManage.role.detail.functions')">
      <menu-tree
        :disabled="dialogTypeRef === AdminDialogType.VIEW"
        :app-key="roleInfo.appKey"
        v-model="roleInfo.menuNos"
        :show-function-group="true"
        multiple
      />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { queryAppInfoListApi } from '@/api/authorization/appInfo'
import { queryRoleApi } from '@/api/authorization/role'
import { RoleInfo } from '@/api/authorization/role/type'
import { ScrollRemoteSeletor } from '@/components/ScrollRemoteSeletor'
import { AdminDialogType } from '@/constants'
import { useI18n } from '@/hooks/web/useI18n'
import { MenuTree } from '@/views/Authorization/component'
import { ElTag, FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'
import { RoleDetailInfo } from '..'
import { AppInfo } from '@/api/authorization/appInfo/types'

defineOptions({
  name: 'RoleDetail'
})

const { t } = useI18n()
const formRef = ref<FormInstance>()
const roleInfo = ref<RoleDetailInfo>({} as RoleDetailInfo)
const appInfo = ref<AppInfo>()
const rules: FormRules = {
  name: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  nameZh: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  appKey: [{ required: true, message: t('validator.required'), trigger: 'blur' }]
}
const dialogTypeRef = ref<AdminDialogType>(AdminDialogType.VIEW)
const init = async (dialogType: AdminDialogType, roleId?: number) => {
  dialogTypeRef.value = dialogType
  if (dialogType === AdminDialogType.ADD || !roleId) {
    roleInfo.value = {} as RoleInfo
    return
  }
  const role = await queryRoleApi(roleId)
  roleInfo.value = { ...role }
  appInfo.value = role.appInfo
}
const getValue = () => {
  formRef.value!.validateField()
  return roleInfo.value
}
defineExpose({ init, getValue })
</script>
