<template>
  <content-wrap>
    <search
      :schema="searchSchema"
      :is-col="false"
      layout="bottom"
      button-position="right"
      @search="queryFunctionList"
      @reset="searchReset"
      @register="searchRegister"
    />
  </content-wrap>
  <content-wrap style="margin-top: 16px">
    <access-control-container :flag="CREATE_FUNCTION_GROUP">
      <div style="margin-bottom: 8px">
        <el-button type="primary" @click="addFunctionGroup">
          {{ t('views.authorManage.functionGroup.operation.add') }}
        </el-button>
      </div>
    </access-control-container>
    <Table
      :columns="columns"
      :data="functionList?.items"
      :loading="loading"
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :pagination="pagination"
    />
    <Dialog
      v-model="functionGroupDetailDialog"
      :title="t(`views.authorManage.functionGroup.dialog.title.${dialogType}`)"
      width="680"
    >
      <function-group-detail v-if="functionGroupDetailDialog" ref="functionGroupDetailRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button
            v-if="dialogType == AdminDialogType.ADD"
            @click="doAddFunctionGroup"
            type="primary"
          >
            {{ t('common.ok') }}
          </el-button>
          <el-button
            v-if="dialogType == AdminDialogType.EDIT"
            @click="doEditFunctionGroup"
            type="primary"
          >
            {{ t('common.ok') }}
          </el-button>
          <el-button @click="functionGroupDetailDialog = false">{{ t('common.close') }}</el-button>
        </div>
      </template>
    </Dialog>
  </content-wrap>
</template>
<script lang="tsx" setup>
import { queryAppInfoListApi } from '@/api/authorization/appInfo'
import { AppInfo } from '@/api/authorization/appInfo/types'
import { CommonStatus, PageResult } from '@/axios/types'
import Dialog from '@/components/Dialog/src/Dialog.vue'
import { FormSchema } from '@/components/Form'
import { QueryOptionItemsParam } from '@/components/ScrollRemoteSeletor/src/types'
import { Pagination, TableColumn, Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useSearch } from '@/hooks/web/useSearch'
import { Action, ElButton, ElMessageBox, ElTag, ElTooltip } from 'element-plus'
import { h, nextTick, onMounted, ref, watch } from 'vue'
import { AccessControlContainer } from '@/components/AccessControlContainer'
import { AdminDialogType } from '@/constants'
import { FunctionGroupDetail, FunctionGroupDetailAction } from './component/index'
import { FunctionGroupInfo, GroupCallType } from '@/api/authorization/function/group/types'
import {
  createFunctionGroupApi,
  disableFunctionGroupApi,
  enableFunctionGroupApi,
  queryFunctionGroupListApi,
  updateFunctionGroupApi
} from '@/api/authorization/function/group'
import {
  CREATE_FUNCTION_GROUP,
  DETAIL_FUNCTION_GROUP,
  UPDATE_FUNCTION_GROUP,
  UPDATE_FUNCTION_GROUP_STATUS
} from '@/api/authorization/function/group/apiFlag'

const { t } = useI18n()
const queryAppInfo = async (param: QueryOptionItemsParam): Promise<PageResult<AppInfo>> => {
  return await queryAppInfoListApi({ ...param, appKey: param.keyword })
}
const searchSchema: FormSchema[] = [
  {
    field: 'no',
    label: t('views.authorManage.functionGroup.no'),
    component: 'Input'
  },
  {
    field: 'title',
    label: t('views.authorManage.functionGroup.title'),
    component: 'Input'
  },
  {
    field: 'groupCallType',
    label: t('views.authorManage.functionGroup.callType'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('views.authorManage.functionGroup.callTypeDesc.byButton'),
          value: GroupCallType.BY_BUTTON
        },
        {
          label: t('views.authorManage.functionGroup.callTypeDesc.byShow'),
          value: GroupCallType.BY_SHOW
        }
      ]
    }
  },
  {
    field: 'appKey',
    label: t('views.authorManage.functionGroup.appKey'),
    component: 'ScrollRemote_selector',
    componentProps: {
      optionKey: 'appKey',
      optionLabel: 'appName',
      optionValue: 'appKey',
      remoteMethod: queryAppInfo
    }
  },
  {
    field: 'status',
    label: t('common.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('common.statusDesc.enable'),
          value: CommonStatus.ENABLE
        },
        {
          label: t('common.statusDesc.disable'),
          value: CommonStatus.DISABLE
        }
      ]
    }
  }
]
const { searchRegister } = useSearch()
const functionList = ref<PageResult<FunctionGroupInfo>>()
const pagination = ref<Pagination>({
  currentPage: functionList.value?.pageNum ?? 1,
  pageSize: functionList.value?.pageSize ?? 20,
  total: functionList.value?.totalCount ?? 0
})
const queryFunctionList = async (param: any = {}) => {
  functionList.value = await queryFunctionGroupListApi({
    ...param,
    pageNo: pagination.value.currentPage,
    pageSize: pagination.value.pageSize
  })
  pagination.value.currentPage = functionList.value!.pageNum
  pagination.value.pageSize = functionList.value!.pageSize
  pagination.value.total = functionList.value!.totalCount
}
watch(() => pagination.value.currentPage, queryFunctionList)
watch(() => pagination.value.pageSize, queryFunctionList)
const searchReset = async () => {
  functionList.value = await queryFunctionGroupListApi({ pageNo: 1, pageSize: 20 })
}
onMounted(() => {
  queryFunctionList()
})
const loading = ref(false)
const columns: TableColumn[] = [
  {
    field: 'no',
    label: t('views.authorManage.functionGroup.no'),
    width: 180
  },
  {
    field: 'title',
    label: t('views.authorManage.functionGroup.title'),
    width: 150
  },
  {
    field: 'groupCallType',
    label: t('views.authorManage.functionGroup.callType'),
    width: 150,
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === GroupCallType.BY_BUTTON ? 'success' : 'primary'
        },
        () =>
          cellValue === GroupCallType.BY_BUTTON
            ? t('views.authorManage.functionGroup.callTypeDesc.byButton')
            : cellValue === GroupCallType.BY_SHOW
              ? t('views.authorManage.functionGroup.callTypeDesc.byShow')
              : ''
      )
    }
  },
  {
    field: 'appInfo',
    label: t('views.authorManage.function.appKey'),
    width: 180,
    formatter: (_: Recordable, __: TableColumn, cellValue: AppInfo) => {
      return h(
        ElTooltip,
        {
          content: cellValue?.appKey,
          placement: 'right',
          effect: 'light'
        },
        {
          default: () => cellValue?.appName
        }
      )
    }
  },
  {
    field: 'frontendPage.title',
    label: t('views.authorManage.functionGroup.frontendPage'),
    width: 150
  },
  {
    field: 'status',
    label: t('common.status'),
    width: 120,
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === CommonStatus.ENABLE ? 'success' : 'danger'
        },
        () =>
          cellValue === CommonStatus.ENABLE
            ? t('common.statusDesc.enable')
            : t('common.statusDesc.disable')
      )
    }
  },
  {
    field: '',
    label: t('common.operation'),
    slots: {
      default: ({ row }: { row: FunctionGroupInfo }) => {
        return (
          <>
            <AccessControlContainer flag={UPDATE_FUNCTION_GROUP}>
              {{
                default: () => (
                  <ElButton onClick={() => editFunctionGroup(row)}>
                    {t('views.authorManage.functionGroup.operation.update')}
                  </ElButton>
                ),
                disabled: () => (
                  <AccessControlContainer flag={DETAIL_FUNCTION_GROUP}>
                    <ElButton onClick={() => viewFunctionGroup(row)}>
                      {t('views.authorManage.functionGroup.operation.detail')}
                    </ElButton>
                  </AccessControlContainer>
                )
              }}
            </AccessControlContainer>
            <AccessControlContainer flag={UPDATE_FUNCTION_GROUP_STATUS}>
              {row.status === CommonStatus.ENABLE ? (
                <ElButton onClick={() => disableFunctionGroup(row)} type="danger">
                  {t('views.authorManage.user.rbac.operation.disable')}
                </ElButton>
              ) : (
                <ElButton onClick={() => enableFunctionGroup(row)} type="warning">
                  {t('views.authorManage.user.rbac.operation.enable')}
                </ElButton>
              )}
            </AccessControlContainer>
          </>
        )
      }
    }
  }
]
const disableFunctionGroup = (menu: FunctionGroupInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.function.operation.disableMessageBoxContent', {
      name: menu.title
    }),
    t('views.authorManage.function.operation.disableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await disableFunctionGroupApi(menu.id)
          await queryFunctionList()
        }
      }
    }
  )
}
const enableFunctionGroup = (role: FunctionGroupInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.function.operation.enableMessageBoxContent', {
      name: role.title
    }),
    t('views.authorManage.function.operation.enableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await enableFunctionGroupApi(role.id)
          await queryFunctionList()
        }
      }
    }
  )
}
const functionGroupDetailRef = ref<FunctionGroupDetailAction>()
const functionGroupDetailDialog = ref(false)
const dialogType = ref<AdminDialogType>(AdminDialogType.VIEW)
const editFunctionGroup = (menu: FunctionGroupInfo) => {
  dialogType.value = AdminDialogType.EDIT
  functionGroupDetailDialog.value = true
  nextTick(() => {
    functionGroupDetailRef.value?.init(dialogType.value, menu.id)
  })
}
const doEditFunctionGroup = async () => {
  const temp = functionGroupDetailRef.value!.getValue()
  await updateFunctionGroupApi({ ...temp })
  await queryFunctionList()
  functionGroupDetailDialog.value = false
}
const viewFunctionGroup = (menu: FunctionGroupInfo) => {
  dialogType.value = AdminDialogType.VIEW
  functionGroupDetailDialog.value = true
  nextTick(() => {
    functionGroupDetailRef.value?.init(dialogType.value, menu.id)
  })
}
const addFunctionGroup = () => {
  dialogType.value = AdminDialogType.ADD
  functionGroupDetailDialog.value = true
  nextTick(() => {
    functionGroupDetailRef.value?.init(dialogType.value)
  })
}
const doAddFunctionGroup = async () => {
  const temp = functionGroupDetailRef.value!.getValue()
  await createFunctionGroupApi({ ...temp })
  await queryFunctionList()
  functionGroupDetailDialog.value = false
}
</script>
