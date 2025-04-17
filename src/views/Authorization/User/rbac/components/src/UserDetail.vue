<template>
  <el-form label-width="auto" style="max-width: 600px">
    <el-form-item :label="t('views.authorManage.user.rbac.username')">
      <el-input :model-value="userDetail?.username" readonly />
    </el-form-item>
    <el-form-item :label="t('views.authorManage.user.rbac.nickname')">
      <el-input :model-value="userDetail?.nickname" readonly />
    </el-form-item>
    <el-form-item :label="t('views.authorManage.user.rbac.detail.appKey')">
      <el-link
        v-if="dialogTypeRef !== AdminDialogType.VIEW"
        type="primary"
        @click="updateBindApp"
        style="margin-right: 16px"
      >
        {{ t('views.authorManage.user.rbac.detail.updateApp') }}
      </el-link>
      <el-tag
        v-for="item in userAppInfos"
        :key="item.appKey"
        :title="item.appKey"
        type="success"
        style="margin-right: 4px"
      >
        {{ item.appName }}
      </el-tag>
    </el-form-item>
    <el-form-item :label="t('views.authorManage.user.rbac.roles')">
      <Table
        style="width: 100%"
        :columns="userDetailColumns"
        :data="userRoles"
        :loading="loading"
      />
      <Dialog
        v-model="updateRoleDialog"
        :title="t('views.authorManage.user.rbac.operation.updateRoleDialogTitle')"
        width="600"
        :max-height="320"
      >
        <UpdateItem
          v-if="updateRoleDialog"
          ref="updateRoleItemRef"
          :item-title="t('views.authorManage.user.rbac.detail.bindedRoles')"
          :all-item-title="t('views.authorManage.user.rbac.detail.allRoles')"
          :items="updateRoleDialogRoleInfo?.roleInfos || []"
          option-key="no"
          option-label="nameZh"
          option-value="id"
          :query-all-items="queryAllRoleItems"
        />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="doUpdateUserRole">{{ t('common.ok') }}</el-button>
            <el-button
              @click="async () => {await init(userDetail!.id, dialogTypeRef);updateRoleDialog = false}"
              >{{ t('common.cancel') }}</el-button
            >
          </div>
        </template>
      </Dialog>
      <Dialog
        v-model="updateBingAppDialog"
        :title="t('views.authorManage.user.rbac.operation.updateBindAppDialogTitle')"
        :width="680"
      >
        <UpdateItem
          v-if="updateBingAppDialog"
          ref="updateAppItemRef"
          :item-title="t('views.authorManage.user.rbac.detail.bindedApp')"
          :all-item-title="t('views.authorManage.user.rbac.detail.allApp')"
          :items="userAppInfos || []"
          option-key="appKey"
          option-label="appName"
          option-value="appKey"
          :query-all-items="queryAllAppItems"
        />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="doUpdateAppInfo">{{ t('common.ok') }}</el-button>
            <el-button
              @click="async () => {await init(userDetail!.id, dialogTypeRef);updateBingAppDialog = false}"
              >{{ t('common.cancel') }}</el-button
            >
          </div>
        </template>
      </Dialog>
    </el-form-item>
  </el-form>
</template>
<script lang="tsx" setup>
import { RBACModelUserInfo } from '@/api/authorization/login/types'
import {
  bindUserRolesApi,
  queryUserApi,
  queryUserRolesApi,
  unbindUserRolesApi,
  bindUserAppsApi,
  unbindUserAppsApi
} from '@/api/authorization/user/rbac'
import { UserRoleInfo } from '@/api/authorization/user/rbac/types'
import { TableColumn } from '@/components/Table'
import { useI18n } from 'vue-i18n'
import { ElButton, ElTag } from 'element-plus'
import { computed, ref } from 'vue'
import { UpdateItem, UpdateItemAction } from '@/views/Authorization/component'
import { QueryOptionItemsParam } from '@/components/ScrollRemoteSeletor/src/types'
import { PageResult } from '@/axios/types'
import { queryRoleListApi } from '@/api/authorization/role'
import { AppInfo } from '@/api/authorization/appInfo/types'
import { queryAppInfoListApi, queryUserAppInfoApi } from '@/api/authorization/appInfo'
import { AdminDialogType } from '@/constants'
import { Dialog } from '@/components/Dialog'

defineOptions({
  name: 'UserDetail'
})

const { t } = useI18n()
const loading = ref(false)
const userDetailColumns = computed(() => {
  const columns: TableColumn[] = [
    {
      field: 'appInfo.appKey',
      width: 150,
      label: t('views.authorManage.user.rbac.detail.appKey')
    },
    {
      field: 'roleInfos',
      label: t('views.authorManage.user.rbac.detail.roles'),
      slots: {
        default: ({ row }: { row: UserRoleInfo }) => {
          return row?.roleInfos?.map((item) => (
            <ElTag type={'info'} style="margin-right: 4px">
              {item.name}
            </ElTag>
          ))
        }
      }
    }
  ]
  if (dialogTypeRef.value !== AdminDialogType.VIEW) {
    columns.push({
      field: '',
      label: t('common.operation'),
      width: 170,
      slots: {
        default: ({ row }: { row: UserRoleInfo }) => {
          return (
            <>
              <ElButton onClick={() => updateRole(row)}>
                {t('views.authorManage.user.rbac.detail.updateRole')}
              </ElButton>
            </>
          )
        }
      }
    })
  }
  return columns
})
const userDetail = ref<RBACModelUserInfo>()
const userRoles = ref<UserRoleInfo[]>()
const userAppInfos = ref<AppInfo[]>()
const dialogTypeRef = ref<AdminDialogType>(AdminDialogType.ADD)

const init = async (userId: number, dialogType: AdminDialogType) => {
  dialogTypeRef.value = dialogType
  if (dialogType === AdminDialogType.ADD) {
    return
  }
  try {
    loading.value = true
    userDetail.value = await queryUserApi(userId)
    userRoles.value = await queryUserRolesApi(userId)
    userAppInfos.value = await queryUserAppInfoApi(userDetail.value.username)
  } finally {
    loading.value = false
  }
}

defineExpose({
  init
})

const updateRoleDialog = ref(false)
const updateRoleDialogRoleInfo = ref<UserRoleInfo>()

const updateRole = (userRole: UserRoleInfo) => {
  updateRoleDialog.value = true
  updateRoleDialogRoleInfo.value = userRole
}
const queryAllRoleItems = async (param: QueryOptionItemsParam): Promise<PageResult<JsonObject>> => {
  const result = await queryRoleListApi({
    pageNo: param.pageNo,
    pageSize: param.pageSize,
    appKey: updateRoleDialogRoleInfo.value?.appInfo.appKey
  })
  return { ...result, items: result.items }
}

const updateRoleItemRef = ref<UpdateItemAction | null>(null)
const doUpdateUserRole = async () => {
  const addedItems = updateRoleItemRef.value?.addedItems()
  const deletedItems = updateRoleItemRef.value?.deletedItems()
  let updated = false
  if (addedItems && addedItems.length > 0) {
    await bindUserRolesApi({
      userId: userDetail.value!.id,
      roleIds: addedItems as number[]
    })
    updated = true
  }
  if (deletedItems && deletedItems.length > 0) {
    await unbindUserRolesApi({
      userId: userDetail.value!.id,
      roleIds: deletedItems as number[]
    })
    updated = true
  }
  if (updated) {
    await init(userDetail.value!.id, dialogTypeRef.value)
  }
  updateRoleDialog.value = false
}

const updateAppItemRef = ref<UpdateItemAction | null>(null)
const updateBingAppDialog = ref(false)
const updateBindApp = async () => {
  updateBingAppDialog.value = true
}

const queryAllAppItems = async (param: QueryOptionItemsParam): Promise<PageResult<JsonObject>> => {
  const result = await queryAppInfoListApi({
    pageNo: param.pageNo,
    pageSize: param.pageSize,
    appKey: param.keyword ?? undefined
  })
  return { ...result, items: result.items }
}

const doUpdateAppInfo = async () => {
  const addedItems = updateAppItemRef.value?.addedItems() ?? []
  const deletedItems = updateAppItemRef.value?.deletedItems() ?? []
  let updated = false
  if (addedItems && addedItems.length > 0) {
    await bindUserAppsApi({
      userId: userDetail.value!.id,
      appKeys: addedItems as string[]
    })
    updated = true
  }
  if (deletedItems && deletedItems.length > 0) {
    await unbindUserAppsApi({
      userId: userDetail.value!.id,
      appKeys: deletedItems as string[]
    })
    updated = true
  }
  console.log(updateAppItemRef.value?.finalItems())
  if (updated) {
    await init(userDetail.value!.id, dialogTypeRef.value)
  }
  updateBingAppDialog.value = false
}
</script>
