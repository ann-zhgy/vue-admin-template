<template>
  <el-form
    :model="functionGroupInfo"
    ref="formRef"
    :rules="rules"
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item
      v-if="dialogTypeRef !== AdminDialogType.ADD"
      prop="no"
      :label="t('views.authorManage.functionGroup.no')"
    >
      <el-input v-model="functionGroupInfo.no" disabled />
    </el-form-item>
    <el-form-item prop="title" :label="t('views.authorManage.functionGroup.title')">
      <el-input
        v-model="functionGroupInfo.title"
        :readonly="dialogTypeRef === AdminDialogType.VIEW"
      />
    </el-form-item>
    <el-form-item prop="appKey" :label="t('views.authorManage.functionGroup.appKey')">
      <el-tag v-if="dialogTypeRef !== AdminDialogType.ADD">
        {{ functionGroupInfo.appInfo?.appName }}
      </el-tag>
      <scroll-remote-seletor
        v-else
        v-model="functionGroupInfo.appKey"
        :remote-method="(param) => queryAppInfoListApi({ appKey: param.keyword, ...param })"
        option-key="appKey"
        option-label="appName"
        option-value="appKey"
      />
    </el-form-item>
    <el-form-item prop="frontendPageNo" :label="t('views.authorManage.functionGroup.frontendPage')">
      <menu-tree
        :disabled="dialogTypeRef !== AdminDialogType.ADD"
        :app-key="functionGroupInfo.appKey"
        v-model="functionGroupInfo.frontendPageNo"
      />
    </el-form-item>
    <el-form-item prop="groupCallType" :label="t('views.authorManage.functionGroup.callType')">
      <el-select
        v-model="functionGroupInfo.groupCallType"
        :disabled="dialogTypeRef === AdminDialogType.VIEW"
      >
        <el-option
          :label="t('views.authorManage.functionGroup.callTypeDesc.byShow')"
          :value="GroupCallType.BY_SHOW"
          :key="GroupCallType.BY_SHOW"
        />
        <el-option
          :label="t('views.authorManage.functionGroup.callTypeDesc.byButton')"
          :value="GroupCallType.BY_BUTTON"
          :key="GroupCallType.BY_BUTTON"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="functionNos" :label="t('views.authorManage.functionGroup.functions')">
      <scroll-remote-seletor
        ref="functionSelectorRef"
        :disabled="dialogTypeRef === AdminDialogType.VIEW"
        v-model="functionGroupInfo.functionNos"
        :init-option-items="functionGroupInfo.functionInfos"
        :remote-method="(param) => queryFunctionListApi({ title: param.keyword, ...param })"
        multiple
        collapse-tags
        collapse-tags-tooltip
        option-key="no"
        option-label="title"
        option-value="no"
      />
    </el-form-item>
  </el-form>
</template>
<script lang="tsx" setup>
import { queryAppInfoListApi } from '@/api/authorization/appInfo'
import { queryFunctionGroupApi } from '@/api/authorization/function/group'
import { GroupCallType } from '@/api/authorization/function/group/types'
import { ScrollRemoteSeletor } from '@/components/ScrollRemoteSeletor'
import { AdminDialogType } from '@/constants'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag, FormInstance, FormRules } from 'element-plus'
import { ComponentInternalInstance, ref } from 'vue'
import { FunctionGroupDetailInfo } from '..'
import { queryFunctionListApi } from '@/api/authorization/function'
import { MenuTree } from '@/views/Authorization/component'

defineOptions({
  name: 'FunctionDetail'
})
const { t } = useI18n()
const functionGroupInfo = ref<FunctionGroupDetailInfo>({} as FunctionGroupDetailInfo)
const dialogTypeRef = ref<AdminDialogType>(AdminDialogType.VIEW)
const formRef = ref<FormInstance>()
const rules: FormRules = {
  title: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  groupCallType: [{ required: true, message: t('validator.required'), trigger: 'blur' }],
  appKey: [{ required: true, message: t('validator.required'), trigger: 'blur' }]
}
const functionSelectorRef = ref<ComponentInternalInstance>()
const init = async (dialogType: AdminDialogType, functionId?: number) => {
  dialogTypeRef.value = dialogType
  if (dialogType === AdminDialogType.ADD || !functionId) {
    functionGroupInfo.value = {} as FunctionGroupDetailInfo
    return
  }
  const functionGroup = await queryFunctionGroupApi(functionId)
  functionGroupInfo.value = {
    ...functionGroup,
    functionNos: functionGroup.functionInfos?.map((item) => item.no) || []
  }
}
const getValue = () => {
  formRef.value!.validateField()
  return functionGroupInfo.value
}
defineExpose({ init, getValue })
</script>
