<template>
  <content-wrap>
    <search
      :schema="searchSchema"
      :is-col="false"
      layout="bottom"
      button-position="right"
      @search="queryUserList"
      @reset="searchReset"
      @register="searchRegister"
    />
  </content-wrap>
  <content-wrap style="margin-top: 16px">
    <Table
      :columns="columns"
      :data="userList?.items"
      :loading="loading"
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :pagination="pagination"
    />
    <Dialog
      v-model="userDetailDialog"
      :title="t(`views.authorManage.user.rbac.dialog.title.${dialogType}`)"
      width="680"
    >
      <user-detail ref="userDetailRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="userDetailDialog = false">{{ t('common.close') }}</el-button>
        </div>
      </template>
    </Dialog>
  </content-wrap>
</template>
<script lang="tsx" setup>
import { RBACModelUserInfo } from '@/api/authorization/login/types'
import { disableUserApi, enableUserApi, userListApi } from '@/api/authorization/user/rbac'
import { CommonStatus, PageResult } from '@/axios/types'
import { FormSchema } from '@/components/Form'
import { Pagination, TableColumn } from '@/components/Table'
import { useSearch } from '@/hooks/web/useSearch'
import { Action, ElButton, ElMessageBox, ElTag } from 'element-plus'
import { h, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserDetail, UserDetailAction } from './components'
import { AdminDialogType } from '@/constants'
import { Dialog } from '@/components/Dialog'
import { AccessControlContainer } from '@/components/AccessControlContainer'
import { DETAIL_USER, UPDATE_USER_STATUS, UPDATE_USER } from '@/api/authorization/user/rbac/apiFlag'

const { t } = useI18n()
const searchSchema: FormSchema[] = [
  {
    field: 'username',
    label: t('views.authorManage.user.rbac.username'),
    component: 'Input'
  },
  {
    field: 'email',
    label: t('views.authorManage.user.rbac.email'),
    component: 'Input'
  },
  {
    field: 'phone',
    label: t('views.authorManage.user.rbac.phone'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('views.authorManage.user.rbac.status'),
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
const userList = ref<PageResult<RBACModelUserInfo>>()
const pagination = ref<Pagination>({
  currentPage: userList.value?.pageNum ?? 1,
  pageSize: userList.value?.pageSize ?? 20,
  total: userList.value?.totalCount ?? 0
})
const queryUserList = async (param: any = {}) => {
  userList.value = await userListApi({
    ...param,
    pageNo: pagination.value.currentPage,
    pageSize: pagination.value.pageSize
  })
  pagination.value.currentPage = userList.value!.pageNum
  pagination.value.pageSize = userList.value!.pageSize
  pagination.value.total = userList.value!.totalCount
}
watch(() => pagination.value.currentPage, queryUserList)
watch(() => pagination.value.pageSize, queryUserList)
const searchReset = async () => {
  userList.value = await userListApi({ pageNo: 1, pageSize: 20 })
}
onMounted(() => {
  queryUserList()
})
const loading = ref(false)
const columns: TableColumn[] = [
  {
    field: 'username',
    label: t('views.authorManage.user.rbac.username')
  },
  {
    field: 'email',
    label: t('views.authorManage.user.rbac.email')
  },
  {
    field: 'phone',
    label: t('views.authorManage.user.rbac.phone')
  },
  {
    field: 'status',
    label: t('common.status'),
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
      default: ({ row }: { row: RBACModelUserInfo }) => {
        return (
          <>
            <AccessControlContainer flag={UPDATE_USER}>
              {{
                default: () => (
                  <ElButton onClick={() => showUserEditDialog(row)}>
                    {t('views.authorManage.user.rbac.operation.userUpdate')}
                  </ElButton>
                ),
                disabled: () => (
                  <AccessControlContainer flag={DETAIL_USER}>
                    {{
                      default: () => (
                        <ElButton onClick={() => showUserDetailDialog(row)}>
                          {t('views.authorManage.user.rbac.operation.userDetail')}
                        </ElButton>
                      )
                    }}
                  </AccessControlContainer>
                )
              }}
            </AccessControlContainer>
            <AccessControlContainer flag={UPDATE_USER_STATUS}>
              {{
                default: () => (
                  <>
                    {row.status === CommonStatus.ENABLE ? (
                      <ElButton onClick={() => disableUser(row)} type="danger">
                        {t('views.authorManage.user.rbac.operation.disable')}
                      </ElButton>
                    ) : (
                      <ElButton onClick={() => enableUser(row)} type="warning">
                        {t('views.authorManage.user.rbac.operation.enable')}
                      </ElButton>
                    )}
                  </>
                )
              }}
            </AccessControlContainer>
          </>
        )
      }
    }
  }
]
const userDetailDialog = ref(false)
const dialogType = ref<AdminDialogType>(AdminDialogType.VIEW)
const userDetailRef = ref<UserDetailAction | null>(null)
const showUserDetailDialog = (user: RBACModelUserInfo) => {
  userDetailDialog.value = true
  dialogType.value = AdminDialogType.VIEW
  nextTick(() => {
    userDetailRef.value?.init(user.id, dialogType.value)
  })
}
const showUserEditDialog = (user: RBACModelUserInfo) => {
  userDetailDialog.value = true
  dialogType.value = AdminDialogType.EDIT
  nextTick(() => {
    userDetailRef.value?.init(user.id, dialogType.value)
  })
}
const disableUser = (user: RBACModelUserInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.user.rbac.operation.disableMessageBoxContent', {
      username: user.username
    }),
    t('views.authorManage.user.rbac.operation.disableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await disableUserApi(user.id)
          await queryUserList()
        }
      }
    }
  )
}

const enableUser = (user: RBACModelUserInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.user.rbac.operation.enableMessageBoxContent', {
      username: user.username
    }),
    t('views.authorManage.user.rbac.operation.enableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await enableUserApi(user.id)
          await queryUserList()
        }
      }
    }
  )
}
</script>
