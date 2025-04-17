<template>
  <content-wrap>
    <Search
      :schema="searchSchema"
      :is-col="false"
      layout="bottom"
      button-position="right"
      @search="queryRoleList"
      @reset="searchReset"
      @register="searchRegister"
    />
  </content-wrap>
  <content-wrap style="margin-top: 16px">
    <div style="margin-bottom: 8px">
      <AccessControlContainer :flag="CREATE_ROLE">
        <el-button type="primary" @click="addRole">
          {{ t('views.authorManage.role.operation.addRole') }}
        </el-button>
      </AccessControlContainer>
    </div>
    <Table
      :columns="columns"
      :data="roleList?.items"
      :loading="loading"
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :pagination="pagination"
    />
    <Dialog
      v-model="roleDetailDialog"
      :title="t(`views.authorManage.role.dialog.title.${dialogType}`)"
      width="680"
    >
      <role-detail v-if="roleDetailDialog" ref="roleDetailRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="dialogType == AdminDialogType.ADD" @click="doAddRole" type="primary">
            {{ t('common.ok') }}
          </el-button>
          <el-button v-if="dialogType == AdminDialogType.EDIT" @click="doEditRole" type="primary">
            {{ t('common.ok') }}
          </el-button>
          <el-button @click="roleDetailDialog = false">{{ t('common.close') }}</el-button>
        </div>
      </template>
    </Dialog>
  </content-wrap>
</template>
<script lang="tsx" setup>
import { queryAppInfoListApi } from '@/api/authorization/appInfo'
import { AppInfo } from '@/api/authorization/appInfo/types'
import {
  createRoleApi,
  disableRoleApi,
  enableRoleApi,
  queryRoleListApi,
  roleExistUserApi,
  updateRoleApi
} from '@/api/authorization/role'
import { RoleInfo, RoleUpdateRequest } from '@/api/authorization/role/type'
import { CommonStatus, PageResult } from '@/axios/types'
import { FormSchema } from '@/components/Form'
import { QueryOptionItemsParam } from '@/components/ScrollRemoteSeletor/src/types'
import { Pagination, Table, TableColumn } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useSearch } from '@/hooks/web/useSearch'
import { Action, ElButton, ElMessageBox, ElTag, ElTooltip } from 'element-plus'
import { h, nextTick, onMounted, ref, watch } from 'vue'
import { RoleDetail, RoleDetailAction } from './components'
import { AdminDialogType } from '@/constants'
import { Dialog } from '@/components/Dialog'
import { AccessControlContainer } from '@/components/AccessControlContainer'
import {
  CREATE_ROLE,
  DETAIL_ROLE,
  UPDATE_ROLE,
  UPDATE_ROLE_STATUS
} from '@/api/authorization/role/apiFlag'
import { Search } from '@/components/Search'

const { t } = useI18n()
const queryAppInfo = async (param: QueryOptionItemsParam): Promise<PageResult<AppInfo>> => {
  return await queryAppInfoListApi({ ...param, appKey: param.keyword })
}
const searchSchema: FormSchema[] = [
  {
    field: 'no',
    label: t('views.authorManage.role.no'),
    component: 'Input'
  },
  {
    field: 'name',
    label: t('views.authorManage.role.name'),
    component: 'Input'
  },
  {
    field: 'nameZh',
    label: t('views.authorManage.role.nameZh'),
    component: 'Input'
  },
  {
    field: 'appKey',
    label: t('views.authorManage.role.appKey'),
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
const roleList = ref<PageResult<RoleInfo>>()
const pagination = ref<Pagination>({
  currentPage: roleList.value?.pageNum ?? 1,
  pageSize: roleList.value?.pageSize ?? 20,
  total: roleList.value?.totalCount ?? 0
})
const queryRoleList = async (param: any = {}) => {
  roleList.value = await queryRoleListApi({
    ...param,
    pageNo: pagination.value.currentPage,
    pageSize: pagination.value.pageSize
  })
  pagination.value.currentPage = roleList.value!.pageNum
  pagination.value.pageSize = roleList.value!.pageSize
  pagination.value.total = roleList.value!.totalCount
}
watch(() => pagination.value.currentPage, queryRoleList)
watch(() => pagination.value.pageSize, queryRoleList)
const searchReset = async () => {
  roleList.value = await queryRoleListApi({ pageNo: 1, pageSize: 20 })
}
onMounted(() => {
  queryRoleList()
})
const loading = ref(false)
const columns: TableColumn[] = [
  {
    field: 'no',
    label: t('views.authorManage.role.no'),
    width: 180
  },
  {
    field: 'name',
    label: t('views.authorManage.role.name'),
    width: 150
  },
  {
    field: 'nameZh',
    label: t('views.authorManage.role.nameZh'),
    width: 150
  },
  {
    field: 'description',
    label: t('views.authorManage.role.description'),
    width: 330
  },
  {
    field: 'appInfo',
    label: t('views.authorManage.role.appKey'),
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
      default: ({ row }: { row: RoleInfo }) => {
        return (
          <>
            <AccessControlContainer flag={UPDATE_ROLE}>
              {{
                default: () => (
                  <ElButton onClick={() => editRole(row)}>
                    {t('views.authorManage.role.operation.updateRole')}
                  </ElButton>
                ),
                disabled: () => (
                  <AccessControlContainer flag={DETAIL_ROLE}>
                    <ElButton onClick={() => viewRole(row)}>
                      {t('views.authorManage.role.operation.roleDetail')}
                    </ElButton>
                  </AccessControlContainer>
                )
              }}
            </AccessControlContainer>
            <AccessControlContainer flag={UPDATE_ROLE_STATUS}>
              {row.status === CommonStatus.ENABLE ? (
                <ElButton onClick={() => disableRole(row)} type="danger">
                  {t('views.authorManage.user.rbac.operation.disable')}
                </ElButton>
              ) : (
                <ElButton onClick={() => enableRole(row)} type="warning">
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

const disableRole = async (role: RoleInfo) => {
  const hasUser = await roleExistUserApi(role.id)
  const messageContent = hasUser
    ? t('views.authorManage.role.operation.disableMessageBoxContentWarn', {
        name: role.nameZh
      })
    : t('views.authorManage.role.operation.disableMessageBoxContent', {
        name: role.nameZh
      })
  ElMessageBox.alert(
    messageContent,
    t('views.authorManage.role.operation.disableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await disableRoleApi(role.id)
          await queryRoleList()
        }
      }
    }
  )
}
const enableRole = (role: RoleInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.role.operation.enableMessageBoxContent', {
      name: role.nameZh
    }),
    t('views.authorManage.role.operation.enableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await enableRoleApi(role.id)
          await queryRoleList()
        }
      }
    }
  )
}
const roleDetailDialog = ref(false)
const roleDetailRef = ref<RoleDetailAction | null>(null)
const dialogType = ref<AdminDialogType>()
const addRole = () => {
  roleDetailDialog.value = true
  dialogType.value = AdminDialogType.ADD
  nextTick(() => {
    roleDetailRef.value?.init(dialogType.value!)
  })
}
const doAddRole = async () => {
  const temp: RoleUpdateRequest = roleDetailRef.value!.getValue()
  try {
    await createRoleApi({ ...temp })
    roleDetailDialog.value = false
    await queryRoleList()
  } catch (e) {}
}
const viewRole = (role: RoleInfo) => {
  roleDetailDialog.value = true
  dialogType.value = AdminDialogType.VIEW
  nextTick(() => {
    roleDetailRef.value?.init(dialogType.value!, role.id)
  })
}
const editRole = (role: RoleInfo) => {
  roleDetailDialog.value = true
  dialogType.value = AdminDialogType.EDIT
  nextTick(() => {
    roleDetailRef.value?.init(dialogType.value!, role.id)
  })
}
const doEditRole = async () => {
  const temp: RoleUpdateRequest = roleDetailRef.value!.getValue()
  console.log('temp', temp)
  try {
    await updateRoleApi({ ...temp })
    roleDetailDialog.value = false
    await queryRoleList()
  } catch (e) {}
}
</script>
