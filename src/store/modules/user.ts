import { defineStore } from 'pinia'
import { store } from '../index'
import { RBACModelUserInfo, SimpleUserInfo } from '@/api/authorization/login/types'
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { logoutApi } from '@/api/authorization/login'
import { useTagsViewStore } from './tagsView'
import router from '@/router'
import { usePermissionStore } from './permission'

interface UserState {
  userInfo?: SimpleUserInfo | RBACModelUserInfo
  token: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      token: ''
    }
  },
  getters: {
    getToken(): string | null {
      return this.token
    },
    getUserInfo(): SimpleUserInfo | RBACModelUserInfo | undefined {
      return this.userInfo
    }
  },
  actions: {
    setToken(token: string | null) {
      this.token = token
    },
    setUserInfo(userInfo?: SimpleUserInfo | RBACModelUserInfo) {
      this.userInfo = userInfo
    },
    logoutConfirm() {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          await logoutApi().catch(() => {})
          this.logout()
        })
        .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken(null)
      this.setUserInfo(undefined)
      router.replace('/login')
      usePermissionStore().resetRouters()
    },
    logout() {
      this.reset()
    }
  },
  persist: {
    paths: ['token']
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
