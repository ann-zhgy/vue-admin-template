import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { AuthorizeModel } from '@/store/modules/app'
import { SimplePermission } from '@/api/authorization/user/simple/types'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/LoginHome.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/author',
    component: Layout,
    name: 'Author',
    redirect: '/author/user-list',
    meta: {
      title: t('router.authorization'),
      icon: 'carbon:id-management'
    },
    children: [
      {
        path: 'user-list',
        name: 'SimpleUserList',
        component: () => import('@/views/Authorization/User/simple/UserList.vue'),
        meta: {
          title: t('router.userManagement'),
          showIn: [AuthorizeModel.SIMPLE],
          permission: [SimplePermission.SUPER_ADMIN]
        }
      },
      {
        path: 'user-list',
        name: 'RbacUserList',
        component: () => import('@/views/Authorization/User/rbac/UserList.vue'),
        meta: {
          title: t('router.userManagement'),
          showIn: [AuthorizeModel.RBAC]
        }
      },
      {
        path: 'role-list',
        name: 'RoleList',
        component: () => import('@/views/Authorization/Role/RoleList.vue'),
        meta: {
          title: t('router.roleManagement'),
          showIn: [AuthorizeModel.RBAC]
        }
      },
      {
        path: 'menu-list',
        name: 'MenuList',
        component: () => import('@/views/Authorization/Menu/MenuList.vue'),
        meta: {
          title: t('router.menuManagement'),
          showIn: [AuthorizeModel.RBAC]
        }
      },
      {
        path: 'function-group-list',
        name: 'FunctionGroupList',
        component: () => import('@/views/Authorization/Function/Group/FunctionGroupList.vue'),
        meta: {
          title: t('router.functionGroupManagement'),
          showIn: [AuthorizeModel.RBAC]
        }
      },
      {
        path: 'function-list',
        name: 'FunctionList',
        component: () => import('@/views/Authorization/Function/FunctionList.vue'),
        meta: {
          title: t('router.functionManagement'),
          showIn: [AuthorizeModel.RBAC]
        }
      },
      {
        path: 'app-info-list',
        name: 'AppInfoList',
        component: () => import('@/views/Authorization/AppInfo/AppInfoList.vue'),
        meta: {
          title: t('router.appInfoManagement'),
          showIn: [AuthorizeModel.RBAC]
        }
      }
    ]
  },
  {
    path: '/level',
    component: Layout,
    redirect: '/level/menu1/menu1-1/menu1-1-1',
    name: 'Level',
    meta: {
      title: t('router.level'),
      icon: 'carbon:skill-level-advanced'
    },
    children: [
      {
        path: 'menu1',
        name: 'Menu1',
        component: getParentLayout(),
        redirect: '/level/menu1/menu1-1/menu1-1-1',
        meta: {
          title: t('router.menu1')
        },
        children: [
          {
            path: 'menu1-1',
            name: 'Menu11',
            component: getParentLayout(),
            redirect: '/level/menu1/menu1-1/menu1-1-1',
            meta: {
              title: t('router.menu11'),
              alwaysShow: true
            },
            children: [
              {
                path: 'menu1-1-1',
                name: 'Menu111',
                component: () => import('@/views/Level/Menu111.vue'),
                meta: {
                  title: t('router.menu111'),
                  permission: [
                    SimplePermission.BASIC,
                    SimplePermission.ADMIN,
                    SimplePermission.SUPER_ADMIN
                  ]
                }
              }
            ]
          },
          {
            path: 'menu1-2',
            name: 'Menu12',
            component: () => import('@/views/Level/Menu12.vue'),
            meta: {
              title: t('router.menu12'),
              permission: [SimplePermission.ADMIN]
            }
          }
        ]
      },
      {
        path: 'menu2',
        name: 'Menu2',
        component: () => import('@/views/Level/Menu2.vue'),
        meta: {
          title: t('router.menu2'),
          permission: [SimplePermission.ADMIN]
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
