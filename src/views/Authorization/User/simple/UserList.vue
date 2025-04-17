<template>
  <content-wrap>
    <Search
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
    <el-dialog
      v-model="updatePermissionDialog"
      :title="t('views.authorManage.user.simple.operation.updatePermission')"
      width="500"
    >
      <el-form label-width="auto" style="max-width: 500px">
        <el-form-item :label="t('views.authorManage.user.simple.username')">
          <el-input v-model="updatePermissionUser!.username" disabled clearable />
        </el-form-item>
        <el-form-item :label="t('views.authorManage.user.simple.permission')">
          <el-select v-model="updatePermissionUser!.permission" multiple>
            <el-option
              :label="SimplePermission.SUPER_ADMIN"
              :value="SimplePermission.SUPER_ADMIN"
            />
            <el-option :label="SimplePermission.ADMIN" :value="SimplePermission.ADMIN" />
            <el-option :label="SimplePermission.BASIC" :value="SimplePermission.BASIC" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="updatePermissionDialog = false">
            {{ t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="doUpdatePermission">
            {{ t('common.ok') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </content-wrap>
</template>
<script lang="tsx" setup>
import { SimpleUserInfo } from '@/api/authorization/login/types'
import {
  userListApi,
  disableUserApi,
  updateUserPermissionApi,
  enableUserApi
} from '@/api/authorization/user/simple'
import { SimplePermission } from '@/api/authorization/user/simple/types'
import { CommonStatus, PageResult } from '@/axios/types'
import { FormSchema } from '@/components/Form'
import { Search } from '@/components/Search'
import { Pagination, Table, TableColumn } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useSearch } from '@/hooks/web/useSearch'
import { Action, ElButton, ElMessageBox, ElTag } from 'element-plus'
import { h, onMounted, reactive, ref, watch } from 'vue'

const { t } = useI18n()

const userList = ref<PageResult<SimpleUserInfo>>()

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'username',
    label: t('views.authorManage.user.simple.username'),
    component: 'Input'
  },
  {
    field: 'email',
    label: t('views.authorManage.user.simple.email'),
    component: 'Input'
  },
  {
    field: 'phone',
    label: t('views.authorManage.user.simple.phone'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('views.authorManage.user.simple.status'),
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
])

const loading = ref(false)
const columns: TableColumn[] = [
  {
    field: 'username',
    label: t('views.authorManage.user.simple.username')
  },
  {
    field: 'email',
    label: t('views.authorManage.user.simple.email')
  },
  {
    field: 'phone',
    label: t('views.authorManage.user.simple.phone')
  },
  {
    field: 'status',
    label: t('views.authorManage.user.simple.status'),
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
    field: 'permission',
    label: t('views.authorManage.user.simple.permission'),
    slots: {
      default: ({ row }) => {
        return row?.permission?.map((item: string) => (
          <ElTag type={'info'} style="margin-right: 4px">
            {item}
          </ElTag>
        ))
      }
    }
  },
  {
    field: '',
    label: t('common.operation'),
    slots: {
      default: ({ row }: { row: SimpleUserInfo }) => {
        return (
          <>
            <ElButton onClick={() => updatePermission(row)}>
              {t('views.authorManage.user.simple.operation.updatePermission')}
            </ElButton>
            {row.status === CommonStatus.ENABLE ? (
              <ElButton onClick={() => disableUser(row)} type="danger">
                {t('views.authorManage.user.simple.operation.disable')}
              </ElButton>
            ) : (
              <ElButton onClick={() => enableUser(row)} type="warning">
                {t('views.authorManage.user.simple.operation.enable')}
              </ElButton>
            )}
          </>
        )
      }
    }
  }
]
const pagination = ref<Pagination>({
  currentPage: userList.value?.pageNum ?? 1,
  pageSize: userList.value?.pageSize ?? 20,
  total: userList.value?.totalCount ?? 0
})

const { searchRegister } = useSearch()

const searchReset = async () => {
  await queryUserList()
}

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

onMounted(async () => {
  await queryUserList()
})

watch(() => pagination.value.currentPage, queryUserList)
watch(() => pagination.value.pageSize, queryUserList)

const updatePermissionDialog = ref(false)
const updatePermissionUser = ref<SimpleUserInfo | null>(null)

const updatePermission = (user: SimpleUserInfo) => {
  updatePermissionDialog.value = true
  updatePermissionUser.value = { ...user }
}

const doUpdatePermission = async () => {
  await updateUserPermissionApi(
    updatePermissionUser.value!.id,
    updatePermissionUser.value!.permission
  )
  updatePermissionDialog.value = false
  await queryUserList()
}

const disableUser = (user: SimpleUserInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.user.simple.operation.disableMessageBoxContent', {
      username: user.username
    }),
    t('views.authorManage.user.simple.operation.disableMessageBoxTitle'),
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

const enableUser = (user: SimpleUserInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.user.simple.operation.enableMessageBoxContent', {
      username: user.username
    }),
    t('views.authorManage.user.simple.operation.enableMessageBoxTitle'),
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
<style lang="less" scoped></style>
