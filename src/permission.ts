import router from './router'
import { AuthorizeModel, useAppStoreWithOut } from '@/store/modules/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { RBACModelUserInfo, SimpleUserInfo } from './api/login/types'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const permissionStore = usePermissionStoreWithOut()
  const appStore = useAppStoreWithOut()
  const userStore = useUserStoreWithOut()
  if (!userStore.getUserInfo) {
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next() // NO_REDIRECT_WHITE_LIST 实际上是不需要登录就可以访问的白名单
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
    return
  }
  if (to.path === '/login') {
    next({ path: '/' })
  } else {
    if (permissionStore.getIsAddRouters) {
      next()
      return
    }

    // 开发者可根据实际情况进行修改
    const userInfo = userStore.getUserInfo || []

    // 是否使用动态路由
    if (!appStore.getDynamicRouter) {
      await permissionStore.generateRoutes('static').catch(() => {})
    } else {
      if (appStore.authorizeModel === AuthorizeModel.SIMPLE) {
        await permissionStore
          .generateRoutes(AuthorizeModel.SIMPLE, (userInfo as SimpleUserInfo).permissions)
          .catch(() => {})
      } else if (appStore.authorizeModel === AuthorizeModel.RBAC) {
        await permissionStore
          .generateRoutes(AuthorizeModel.RBAC, (userInfo as RBACModelUserInfo).menus)
          .catch(() => {})
      } else {
        throw new Error('主题配置错误：请选择权限模式！')
      }
    }

    permissionStore.getAddRouters.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
    })
    const redirectPath = from.query.redirect || to.path
    const redirect = decodeURIComponent(redirectPath as string)
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
    permissionStore.setIsAddRouters(true)
    next(nextData)
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
