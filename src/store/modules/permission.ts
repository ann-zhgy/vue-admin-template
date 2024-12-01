import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  generateRoutesBySimpleAuthorizeModel,
  generateRoutesByRBACAuthorizeModel,
  flatMultiLevelRoutes,
  generateRoutesByNoneAuthorizeModel
} from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { MenuInfo } from '@/api/login/types'
import { AuthorizeModel } from './app'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(
      type: 'static' | AuthorizeModel,
      routers?: MenuInfo[] | string[]
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'static') {
          // 直接读取静态路由表
          routerMap = generateRoutesByNoneAuthorizeModel(cloneDeep(asyncRouterMap))
        } else if (type === AuthorizeModel.SIMPLE) {
          // 模拟前端过滤菜单
          routerMap = generateRoutesBySimpleAuthorizeModel(
            cloneDeep(asyncRouterMap),
            routers as string[]
          )
        } else if (type === AuthorizeModel.RBAC) {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByRBACAuthorizeModel(
            cloneDeep(asyncRouterMap),
            routers as MenuInfo[]
          )
        } else {
          throw new Error('generateRoutes param [type] invalid!', type)
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    },
    resetRouters(): void {
      this.isAddRouters = false
      this.routers = cloneDeep(constantRouterMap)
      this.addRouters = []
    }
  },
  persist: {
    paths: ['routers', 'addRouters', 'menuTabRouters']
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
