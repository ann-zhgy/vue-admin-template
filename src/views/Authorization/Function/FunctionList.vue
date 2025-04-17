<template>
  <content-wrap>
    <search
      ref="searchRef"
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
    <access-control-container :flag="CREATE_FUNCTION">
      <div style="margin-bottom: 8px">
        <el-button type="primary" @click="addFunction">
          {{ t('views.authorManage.menu.operation.addMenu') }}
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
      v-model="functionDetailDialog"
      :title="t(`views.authorManage.function.dialog.title.${dialogType}`)"
      width="680"
    >
      <function-detail v-if="functionDetailDialog" ref="functionDetailRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="dialogType == AdminDialogType.ADD" @click="doAddFunction" type="primary">
            {{ t('common.ok') }}
          </el-button>
          <el-button
            v-if="dialogType == AdminDialogType.EDIT"
            @click="doEditFunction"
            type="primary"
          >
            {{ t('common.ok') }}
          </el-button>
          <el-button @click="functionDetailDialog = false">{{ t('common.close') }}</el-button>
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
import { FunctionInfo } from '@/api/authorization/function/types'
import {
  createFunctionApi,
  disableFunctionApi,
  enableFunctionApi,
  queryFunctionListApi,
  updateFunctionApi
} from '@/api/authorization/function'
import {
  CREATE_FUNCTION,
  DETAIL_FUNCTION,
  UPDATE_FUNCTION,
  UPDATE_FUNCTION_STATUS
} from '@/api/authorization/function/apiFlag'
import { FunctionDetail, FunctionDetailAction } from './component'
import { SearchExpose } from '@/components/Search'

const { t } = useI18n()
const queryAppInfo = async (param: QueryOptionItemsParam): Promise<PageResult<AppInfo>> => {
  return await queryAppInfoListApi({ ...param, appKey: param.keyword })
}
const searchSchema: FormSchema[] = [
  {
    field: 'no',
    label: t('views.authorManage.function.no'),
    component: 'Input'
  },
  {
    field: 'title',
    label: t('views.authorManage.function.title'),
    component: 'Input'
  },
  {
    field: 'requestMethod',
    label: t('views.authorManage.function.requestMethod'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'GET',
          value: 'get'
        },
        {
          label: 'POST',
          value: 'post'
        },
        {
          label: 'PUT',
          value: 'put'
        },
        {
          label: 'DELETE',
          value: 'delete'
        }
      ]
    }
  },
  {
    field: 'requestUrl',
    label: t('views.authorManage.function.requestUrl'),
    component: 'Input'
  },
  {
    field: 'appKey',
    label: t('views.authorManage.function.appKey'),
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
const functionList = ref<PageResult<FunctionInfo>>()
const pagination = ref<Pagination>({
  currentPage: functionList.value?.pageNum ?? 1,
  pageSize: functionList.value?.pageSize ?? 20,
  total: functionList.value?.totalCount ?? 0
})
const queryFunctionList = async (param: any = {}) => {
  functionList.value = await queryFunctionListApi({
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
  functionList.value = await queryFunctionListApi({ pageNo: 1, pageSize: 20 })
}
onMounted(() => {
  queryFunctionList()
})
const loading = ref(false)
const searchRef = ref<SearchExpose>()
const columns: TableColumn[] = [
  {
    field: 'no',
    label: t('views.authorManage.function.no'),
    width: 180
  },
  {
    field: 'title',
    label: t('views.authorManage.function.title'),
    width: 150
  },
  {
    field: 'requestMethod',
    label: t('views.authorManage.function.requestMethod'),
    width: 150
  },
  {
    field: 'requestUrl',
    label: t('views.authorManage.function.requestUrl'),
    width: 330
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
      default: ({ row }: { row: FunctionInfo }) => {
        return (
          <>
            <AccessControlContainer flag={UPDATE_FUNCTION}>
              {{
                default: () => (
                  <ElButton onClick={() => editFunction(row)}>
                    {t('views.authorManage.function.operation.update')}
                  </ElButton>
                ),
                disabled: () => (
                  <AccessControlContainer flag={DETAIL_FUNCTION}>
                    <ElButton onClick={() => viewFunction(row)}>
                      {t('views.authorManage.function.operation.detail')}
                    </ElButton>
                  </AccessControlContainer>
                )
              }}
            </AccessControlContainer>
            <AccessControlContainer flag={UPDATE_FUNCTION_STATUS}>
              {row.status === CommonStatus.ENABLE ? (
                <ElButton onClick={() => disableFunction(row)} type="danger">
                  {t('views.authorManage.user.rbac.operation.disable')}
                </ElButton>
              ) : (
                <ElButton onClick={() => enableFunction(row)} type="warning">
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
const disableFunction = (menu: FunctionInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.function.operation.disableMessageBoxContent', {
      name: menu.title
    }),
    t('views.authorManage.function.operation.disableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await disableFunctionApi(menu.id)
          console.log(searchRef.value?.formModel)
          await queryFunctionList(searchRef.value?.formModel)
        }
      }
    }
  )
}
const enableFunction = (role: FunctionInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.function.operation.enableMessageBoxContent', {
      name: role.title
    }),
    t('views.authorManage.function.operation.enableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await enableFunctionApi(role.id)
          await queryFunctionList(searchRef.value?.formModel)
        }
      }
    }
  )
}
const functionDetailRef = ref<FunctionDetailAction>()
const functionDetailDialog = ref(false)
const dialogType = ref<AdminDialogType>(AdminDialogType.VIEW)
const editFunction = (menu: FunctionInfo) => {
  dialogType.value = AdminDialogType.EDIT
  functionDetailDialog.value = true
  nextTick(() => {
    functionDetailRef.value?.init(dialogType.value, menu.id)
  })
}
const doEditFunction = async () => {
  const temp = functionDetailRef.value!.getValue()
  await updateFunctionApi({ ...temp })
  await queryFunctionList()
  functionDetailDialog.value = false
}
const viewFunction = (menu: FunctionInfo) => {
  dialogType.value = AdminDialogType.VIEW
  functionDetailDialog.value = true
  nextTick(() => {
    functionDetailRef.value?.init(dialogType.value, menu.id)
  })
}
const addFunction = () => {
  dialogType.value = AdminDialogType.ADD
  functionDetailDialog.value = true
  nextTick(() => {
    functionDetailRef.value?.init(dialogType.value)
  })
}
const doAddFunction = async () => {
  const temp = functionDetailRef.value!.getValue()
  await createFunctionApi({ ...temp })
  await queryFunctionList()
  functionDetailDialog.value = false
}
</script>
