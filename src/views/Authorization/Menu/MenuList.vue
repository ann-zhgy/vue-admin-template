<template>
  <content-wrap>
    <search
      :schema="searchSchema"
      :is-col="false"
      layout="bottom"
      button-position="right"
      @search="queryMenuList"
      @reset="searchReset"
      @register="searchRegister"
    />
  </content-wrap>
  <content-wrap style="margin-top: 16px">
    <access-control-container :flag="CREATE_MENU">
      <div style="margin-bottom: 8px">
        <el-button type="primary" @click="addMenu">
          {{ t('views.authorManage.menu.operation.addMenu') }}
        </el-button>
      </div>
    </access-control-container>
    <Table
      :columns="columns"
      :data="menuList?.items"
      :loading="loading"
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :pagination="pagination"
    />
    <Dialog
      v-model="menuDetailDialog"
      :title="t(`views.authorManage.menu.dialog.title.${dialogType}`)"
      width="680"
    >
      <menu-detail v-if="menuDetailDialog" ref="menuDetailRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="dialogType == AdminDialogType.ADD" @click="doAddMenu" type="primary">
            {{ t('common.ok') }}
          </el-button>
          <el-button v-if="dialogType == AdminDialogType.EDIT" @click="doEditMenu" type="primary">
            {{ t('common.ok') }}
          </el-button>
          <el-button @click="menuDetailDialog = false">{{ t('common.close') }}</el-button>
        </div>
      </template>
    </Dialog>
  </content-wrap>
</template>
<script lang="tsx" setup>
import { queryAppInfoListApi } from '@/api/authorization/appInfo'
import { AppInfo } from '@/api/authorization/appInfo/types'
import {
  createMenuApi,
  disableMenuApi,
  enableMenuApi,
  queryMenuListApi,
  updateMenuApi
} from '@/api/authorization/menu'
import { MenuInfo } from '@/api/authorization/menu/types'
import { CommonStatus, PageResult } from '@/axios/types'
import Dialog from '@/components/Dialog/src/Dialog.vue'
import { FormSchema } from '@/components/Form'
import { QueryOptionItemsParam } from '@/components/ScrollRemoteSeletor/src/types'
import { Pagination, TableColumn, Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useSearch } from '@/hooks/web/useSearch'
import { Action, ElButton, ElMessageBox, ElTag, ElTooltip } from 'element-plus'
import { h, nextTick, onMounted, ref, watch } from 'vue'
import { MenuDetail, MenuDetailAction } from './components'
import { AccessControlContainer } from '@/components/AccessControlContainer'
import { AdminDialogType } from '@/constants'
import {
  CREATE_MENU,
  DETAIL_MENU,
  UPDATE_MENU,
  UPDATE_MENU_STATUS
} from '@/api/authorization/menu/apiFlag'
import { Icon } from '@/components/Icon'

const { t } = useI18n()
const queryAppInfo = async (param: QueryOptionItemsParam): Promise<PageResult<AppInfo>> => {
  return await queryAppInfoListApi({ ...param, appKey: param.keyword })
}
const searchSchema: FormSchema[] = [
  {
    field: 'no',
    label: t('views.authorManage.menu.no'),
    component: 'Input'
  },
  {
    field: 'titlr',
    label: t('views.authorManage.menu.title'),
    component: 'Input'
  },
  {
    field: 'componentKey',
    label: t('views.authorManage.menu.componentKey'),
    component: 'Input'
  },
  {
    field: 'parentNo',
    label: t('views.authorManage.menu.parentNo'),
    component: 'Input'
  },
  {
    field: 'appKey',
    label: t('views.authorManage.menu.appKey'),
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
const menuList = ref<PageResult<MenuInfo>>()
const pagination = ref<Pagination>({
  currentPage: menuList.value?.pageNum ?? 1,
  pageSize: menuList.value?.pageSize ?? 20,
  total: menuList.value?.totalCount ?? 0
})
const queryMenuList = async (param: any = {}) => {
  menuList.value = await queryMenuListApi({
    ...param,
    pageNo: pagination.value.currentPage,
    pageSize: pagination.value.pageSize
  })
  pagination.value.currentPage = menuList.value!.pageNum
  pagination.value.pageSize = menuList.value!.pageSize
  pagination.value.total = menuList.value!.totalCount
}
watch(() => pagination.value.currentPage, queryMenuList)
watch(() => pagination.value.pageSize, queryMenuList)
const searchReset = async () => {
  menuList.value = await queryMenuListApi({ pageNo: 1, pageSize: 20 })
}
onMounted(() => {
  queryMenuList()
})
const loading = ref(false)
const columns: TableColumn[] = [
  {
    field: 'no',
    label: t('views.authorManage.menu.no'),
    width: 180
  },
  {
    field: 'title',
    label: t('views.authorManage.menu.title'),
    width: 180,
    slots: {
      default: ({ row }: { row: MenuInfo }) => {
        return (
          <>
            {row.staticPage ? (
              <ElTooltip content="静态页面" placement="left" effect="light">
                <Icon icon="carbon:content-view" />
              </ElTooltip>
            ) : (
              ''
            )}{' '}
            {row.title}
          </>
        )
      }
    }
  },
  {
    field: 'parentNo',
    label: t('views.authorManage.menu.parentNo'),
    width: 150
  },
  {
    field: 'componentKey',
    label: t('views.authorManage.menu.componentKey'),
    width: 330
  },
  {
    field: 'appInfo',
    label: t('views.authorManage.menu.appKey'),
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
      default: ({ row }: { row: MenuInfo }) => {
        return (
          <>
            <AccessControlContainer flag={UPDATE_MENU}>
              {{
                default: () => (
                  <ElButton onClick={() => editMenu(row)}>
                    {t('views.authorManage.menu.operation.updateMenu')}
                  </ElButton>
                ),
                disabled: () => (
                  <AccessControlContainer flag={DETAIL_MENU}>
                    <ElButton onClick={() => viewMenu(row)}>
                      {t('views.authorManage.menu.operation.menuDetail')}
                    </ElButton>
                  </AccessControlContainer>
                )
              }}
            </AccessControlContainer>
            <AccessControlContainer flag={UPDATE_MENU_STATUS}>
              {row.status === CommonStatus.ENABLE ? (
                <ElButton onClick={() => disableMenu(row)} type="danger">
                  {t('views.authorManage.user.rbac.operation.disable')}
                </ElButton>
              ) : (
                <ElButton onClick={() => enableMenu(row)} type="warning">
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
const disableMenu = (menu: MenuInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.menu.operation.disableMessageBoxContent', {
      name: menu.title
    }),
    t('views.authorManage.menu.operation.disableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await disableMenuApi(menu.id)
          await queryMenuList()
        }
      }
    }
  )
}
const enableMenu = (role: MenuInfo) => {
  ElMessageBox.alert(
    t('views.authorManage.menu.operation.enableMessageBoxContent', {
      name: role.title
    }),
    t('views.authorManage.menu.operation.enableMessageBoxTitle'),
    {
      confirmButtonText: t('common.ok'),
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await enableMenuApi(role.id)
          await queryMenuList()
        }
      }
    }
  )
}
const menuDetailRef = ref<MenuDetailAction>()
const menuDetailDialog = ref(false)
const dialogType = ref<AdminDialogType>(AdminDialogType.VIEW)
const editMenu = (menu: MenuInfo) => {
  dialogType.value = AdminDialogType.EDIT
  menuDetailDialog.value = true
  nextTick(() => {
    menuDetailRef.value?.init(dialogType.value, menu.id)
  })
}
const doEditMenu = async () => {
  const temp = menuDetailRef.value!.getValue()
  await updateMenuApi({ ...temp })
  await queryMenuList()
  menuDetailDialog.value = false
}
const viewMenu = (menu: MenuInfo) => {
  dialogType.value = AdminDialogType.VIEW
  menuDetailDialog.value = true
  nextTick(() => {
    menuDetailRef.value?.init(dialogType.value, menu.id)
  })
}
const addMenu = () => {
  dialogType.value = AdminDialogType.ADD
  menuDetailDialog.value = true
  nextTick(() => {
    menuDetailRef.value?.init(dialogType.value)
  })
}
const doAddMenu = async () => {
  const temp = menuDetailRef.value!.getValue()
  await createMenuApi({ ...temp })
  await queryMenuList()
  menuDetailDialog.value = false
}
</script>
