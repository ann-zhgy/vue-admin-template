<template>
  <el-form
    :model="functionInfo"
    ref="formRef"
    :rules="rules"
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item
      v-if="dialogTypeRef !== AdminDialogType.ADD"
      prop="no"
      :label="t('views.authorManage.function.no')"
    >
      <el-input v-model="functionInfo.no" disabled />
    </el-form-item>
    <el-form-item prop="title" :label="t('views.authorManage.function.title')">
      <el-input v-model="functionInfo.title" :readonly="dialogTypeRef === AdminDialogType.VIEW" />
    </el-form-item>
    <el-form-item prop="requestMethod" :label="t('views.authorManage.function.requestMethod')">
      <el-tag v-if="dialogTypeRef === AdminDialogType.VIEW">
        {{ functionInfo.requestMethod?.toUpperCase() }}
      </el-tag>
      <el-select v-else v-model="functionInfo.requestMethod" clearable>
        <el-option key="get" label="GET" value="get" />
        <el-option key="post" label="POST" value="post" />
        <el-option key="put" label="PUT" value="put" />
        <el-option key="delete" label="DELETE" value="delete" />
      </el-select>
    </el-form-item>
    <el-form-item prop="requestUrl" :label="t('views.authorManage.function.requestUrl')">
      <el-input
        v-model="functionInfo.requestUrl"
        :readonly="dialogTypeRef === AdminDialogType.VIEW"
      />
    </el-form-item>
    <el-form-item prop="appKey" :label="t('views.authorManage.function.appKey')">
      <el-tag v-if="dialogTypeRef !== AdminDialogType.ADD">
        {{ functionInfo.appInfo?.appName }}
      </el-tag>
      <scroll-remote-seletor
        v-else
        v-model="functionInfo.appKey"
        :remote-method="(param) => queryAppInfoListApi({ appKey: param.keyword, ...param })"
        option-key="appKey"
        option-label="appName"
        option-value="appKey"
      />
    </el-form-item>
  </el-form>
</template>
<script lang="tsx" setup>
import { queryAppInfoListApi } from '@/api/authorization/appInfo'
import { queryFunctionApi } from '@/api/authorization/function'
import { FunctionInfo } from '@/api/authorization/function/types'
import { ScrollRemoteSeletor } from '@/components/ScrollRemoteSeletor'
import { AdminDialogType } from '@/constants'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag, FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'

defineOptions({
  name: 'FunctionDetail'
})

const { t } = useI18n()
const functionInfo = ref<FunctionInfo>({} as FunctionInfo)
const dialogTypeRef = ref<AdminDialogType>()
const formRef = ref<FormInstance>()
const rules: FormRules = {
  title: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  requestMethod: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  appKey: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  requestUrl: [{ required: true, message: t('validator.required'), trigger: 'blur' }]
}
const init = async (dialogType: AdminDialogType, functionId?: number) => {
  dialogTypeRef.value = dialogType
  if (dialogType === AdminDialogType.ADD || !functionId) {
    functionInfo.value = {} as FunctionInfo
    return
  }
  functionInfo.value = await queryFunctionApi(functionId)
}
const getValue = () => {
  formRef.value!.validateField()
  return functionInfo.value
}
defineExpose({ init, getValue })
</script>
