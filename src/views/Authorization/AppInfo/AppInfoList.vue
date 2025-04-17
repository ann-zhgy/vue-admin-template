<template>
  <content-wrap>
    <search
      :schema="searchSchema"
      :is-col="false"
      layout="bottom"
      button-position="right"
      @search="queryAppInfoList"
      @reset="searchReset"
      @register="searchRegister"
    />
  </content-wrap>
  <content-wrap style="margin-top: 16px">
    <access-control-container :flag="CREATE_APP">
      <div style="margin-bottom: 8px">
        <el-button type="primary" @click="addAppInfo">
          {{ t('views.authorManage.menu.operation.addMenu') }}
        </el-button>
      </div>
    </access-control-container>
    <Table
      :columns="columns"
      :data="appInfoList?.items"
      :loading="loading"
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :pagination="pagination"
    />
    <Dialog
      v-model="appInfoDetailDialog"
      :title="t(`views.authorManage.function.dialog.title.${dialogType}`)"
      width="680"
    >
      <app-info-detail v-if="appInfoDetailDialog" ref="appInfoDetailRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="dialogType == AdminDialogType.ADD" @click="doAddAppInfo" type="primary">
            {{ t('common.ok') }}
          </el-button>
          <el-button
            v-if="dialogType == AdminDialogType.EDIT"
            @click="doEditAppInfo"
            type="primary"
          >
            {{ t('common.ok') }}
          </el-button>
          <el-button @click="appInfoDetailDialog = false">{{ t('common.close') }}</el-button>
        </div>
      </template>
    </Dialog>
  </content-wrap>
</template>
<script lang="tsx" setup>
import {
  AccessControlType,
  AppInfo,
  AppType,
  GrantAccessPermissionType
} from '@/api/authorization/appInfo/types'
import { CommonStatus, PageResult } from '@/axios/types'
import Dialog from '@/components/Dialog/src/Dialog.vue'
import { FormSchema } from '@/components/Form'
import { Pagination, TableColumn, Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useSearch } from '@/hooks/web/useSearch'
import { Action, ElButton, ElMessageBox, ElTag } from 'element-plus'
import { h, nextTick, onMounted, ref, watch } from 'vue'
import { AccessControlContainer } from '@/components/AccessControlContainer'
import { AdminDialogType } from '@/constants'
import {
  CREATE_APP,
  DETAIL_APP,
  UPDATE_APP,
  UPDATE_APP_STATUS
} from '@/api/authorization/appInfo/apiFlag'
import {
  createAppInfoApi,
  disableAppInfoApi,
  enableAppInfoApi,
  queryAppInfoListApi,
  updateAppInfoApi
} from '@/api/authorization/appInfo'
import { AppInfoDetail, AppInfoDetailAction } from './compoment'

const { t } = useI18n()
const searchSchema: FormSchema[] = [
  {
    field: 'appKey',
    label: t('views.authorManage.appInfo.appKey'),
    component: 'Input'
  },
  {
    field: 'appName',
    label: t('views.authorManage.appInfo.appName'),
    component: 'Input'
  },
  {
    field: 'accessControlBy',
    label: t('views.authorManage.appInfo.accessControlBy'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('views.authorManage.appInfo.accessControlByDesc.byRbac'),
          value: AccessControlType.BY_RBAC
        },
        {
          label: t('views.authorManage.appInfo.accessControlByDesc.bySelf'),
          value: AccessControlType.BY_SELF
        }
      ]
    }
  },
  {
    field: 'grantAccessPermissionBy',
    label: t('views.authorManage.appInfo.grantAccessPermissionBy'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('views.authorManage.appInfo.grantAccessPermissionByDesc.byAuto'),
          value: GrantAccessPermissionType.AUTO
        },
        {
          label: t('views.authorManage.appInfo.grantAccessPermissionByDesc.byManual'),
          value: GrantAccessPermissionType.MANUAL
        }
      ]
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
const appInfoList = ref<PageResult<AppInfo>>()
const pagination = ref<Pagination>({
  currentPage: appInfoList.value?.pageNum ?? 1,
  pageSize: appInfoList.value?.pageSize ?? 20,
  total: appInfoList.value?.totalCount ?? 0
})
const queryAppInfoList = async (param: any = {}) => {
  appInfoList.value = await queryAppInfoListApi({
    ...param,
    pageNo: pagination.value.currentPage,
    pageSize: pagination.value.pageSize
  })
  pagination.value.currentPage = appInfoList.value!.pageNum
  pagination.value.pageSize = appInfoList.value!.pageSize
  pagination.value.total = appInfoList.value!.totalCount
}
watch(() => pagination.value.currentPage, queryAppInfoList)
watch(() => pagination.value.pageSize, queryAppInfoList)
const searchReset = async () => {
  appInfoList.value = await queryAppInfoListApi({ pageNo: 1, pageSize: 20 })
}
onMounted(() => {
  queryAppInfoList()
})
const loading = ref(false)
const columns: TableColumn[] = [
  {
    field: 'appKey',
    label: t('views.authorManage.appInfo.appKey'),
    width: 180
  },
  {
    field: 'appName',
    label: t('views.authorManage.appInfo.appName'),
    width: 150
  },
  {
    field: 'accessControlBy',
    label: t('views.authorManage.appInfo.accessControlBy'),
    width: 150,
    formatter: (_: Recordable, __: TableColumn, cellValue: AccessControlType) => {
      return h(
        ElTag,
        {
          type: cellValue === AccessControlType.BY_RBAC ? 'primary' : 'warning'
        },
        () =>
          cellValue === AccessControlType.BY_RBAC
            ? t('views.authorManage.appInfo.accessControlByDesc.byRbac')
            : cellValue === AccessControlType.BY_SELF
              ? t('views.authorManage.appInfo.accessControlByDesc.bySelf')
              : ''
      )
    }
  },
  {
    field: 'grantAccessPermissionBy',
    label: t('views.authorManage.appInfo.grantAccessPermissionBy'),
    width: 150,
    formatter: (_: Recordable, __: TableColumn, cellValue: GrantAccessPermissionType) => {
      return h(
        ElTag,
        {
          type: cellValue === GrantAccessPermissionType.AUTO ? 'primary' : 'success'
        },
        () =>
          cellValue === GrantAccessPermissionType.AUTO
            ? t('views.authorManage.appInfo.grantAccessPermissionByDesc.byAuto')
            : cellValue === GrantAccessPermissionType.MANUAL
              ? t('views.authorManage.appInfo.grantAccessPermissionByDesc.byManual')
              : ''
      )
    }
  },
  {
    field: 'appType',
    label: t('views.authorManage.appInfo.appType'),
    width: 180,
    slots: {
      default: ({ row }: { row: AppInfo }) => {
        return (
          <>
            {row.appType?.map((item: AppType) => {
              return (
                <ElTag type={'info'} style={'margin: 0 2px'}>
                  {t(`views.authorManage.appInfo.appTypeDesc.${item}`)}
                </ElTag>
              )
            })}
          </>
        )
      }
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
      default: ({ row }: { row: AppInfo }) => {
        return (
          <>
            <AccessControlContainer flag={UPDATE_APP}>
              {{
                default: () => (
                  <ElButton onClick={() => editAppInfo(row)}>
                    {t('views.authorManage.appInfo.operation.update')}
                  </ElButton>
                ),
                disabled: () => (
                  <AccessControlContainer flag={DETAIL_APP}>
                    <ElButton onClick={() => viewAppInfo(row)}>
                      {t('views.authorManage.appInfo.operation.detail')}
                    </ElButton>
                  </AccessControlContainer>
                )
              }}
            </AccessControlContainer>
            <AccessControlContainer flag={UPDATE_APP_STATUS}>
              {row.status === CommonStatus.ENABLE ? (
                <ElButton onClick={() => disableAppInfo(row)} type="danger">
                  {t('views.authorManage.appInfo.operation.disable')}
                </ElButton>
              ) : (
                <ElButton onClick={() => enableAppInfo(row)} type="warning">
                  {t('views.authorManage.appInfo.operation.enable')}
                </ElButton>
              )}
            </AccessControlContainer>
          </>
        )
      }
    }
  }
]
const disableAppInfo = (appInfo: AppInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.appInfo.operation.disableMessageBoxContent', {
      name: appInfo.appKey
    }),
    t('views.authorManage.appInfo.operation.disableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await disableAppInfoApi(appInfo.id)
          await queryAppInfoList()
        }
      }
    }
  )
}
const enableAppInfo = (appInfo: AppInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.appInfo.operation.enableMessageBoxContent', {
      name: appInfo.appKey
    }),
    t('views.authorManage.appInfo.operation.enableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await enableAppInfoApi(appInfo.id)
          await queryAppInfoList()
        }
      }
    }
  )
}
const appInfoDetailRef = ref<AppInfoDetailAction>()
const appInfoDetailDialog = ref(false)
const dialogType = ref<AdminDialogType>(AdminDialogType.VIEW)
const editAppInfo = (appInfo: AppInfo) => {
  dialogType.value = AdminDialogType.EDIT
  appInfoDetailDialog.value = true
  nextTick(() => {
    appInfoDetailRef.value?.init(dialogType.value, appInfo.id)
  })
}
const doEditAppInfo = async () => {
  const temp = appInfoDetailRef.value!.getValue()
  await updateAppInfoApi({ ...temp })
  await queryAppInfoList()
  appInfoDetailDialog.value = false
}
const viewAppInfo = (appInfo: AppInfo) => {
  dialogType.value = AdminDialogType.VIEW
  appInfoDetailDialog.value = true
  nextTick(() => {
    appInfoDetailRef.value?.init(dialogType.value, appInfo.id)
  })
}
const addAppInfo = () => {
  dialogType.value = AdminDialogType.ADD
  appInfoDetailDialog.value = true
  nextTick(() => {
    appInfoDetailRef.value?.init(dialogType.value)
  })
}
const doAddAppInfo = async () => {
  const temp = appInfoDetailRef.value!.getValue()
  await createAppInfoApi({ ...temp })
  await queryAppInfoList()
  appInfoDetailDialog.value = false
}
</script>
