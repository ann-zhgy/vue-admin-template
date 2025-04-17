import { createRouter, createWebHashHistory } from 'vue-router'
import type {
  Router,
  RouteLocationNormalized,
  RouteRecordNormalized,
  RouteRecordRaw,
  RouteMeta
} from 'vue-router'
import { isUrl } from '@/utils/is'
import { omit, cloneDeep } from 'lodash-es'
import { MenuInfo } from '@/api/authorization/login/types'
import { AuthorizeModel } from '@/store/modules/app'

/* Layout */
export const Layout = () => import('@/layout/Layout.vue')

export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: 'ParentLayout'
      })
    })
}

export const getRawRoute = (route: RouteLocationNormalized): RouteLocationNormalized => {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path
        }))
      : undefined) as RouteRecordNormalized[]
  }
}

// 前端控制路由生成
export const generateRoutesByNoneAuthorizeModel = (
  routes: AppRouteRecordRaw[],
  basePath = '/'
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const meta: RouteMeta = route.meta ?? {}

    const data: AppRouteRecordRaw = Object.assign({}, route)
    // 如果路由是具体的页面，就做权限校验
    if (!route.redirect) {
      if (meta.showIn !== undefined && meta.showIn.indexOf('static') === -1) {
        continue
      }
    }
    // 如果路由是菜单的中间节点，找有权限的子节点
    else if (route.children) {
      data.children = generateRoutesByNoneAuthorizeModel(
        route.children,
        pathResolve(basePath, data.path)
      )
    }
    // 走到这里意味着菜单是有权限的页面或者可能有有权限的子节点
    // 如果是有权限的页面，或者是子节点有页面的中间节点，就push到res中
    if (!data.children || data.children.length > 0) {
      res.push(data as AppRouteRecordRaw)
    }
  }
  return res
}

// 简单权限模型控制路由生成
export const generateRoutesBySimpleAuthorizeModel = (
  routes: AppRouteRecordRaw[],
  permissions: string[],
  basePath = '/'
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  const permissionSet = new Set(permissions)

  for (const route of routes) {
    const meta: RouteMeta = route.meta ?? {}

    const data: AppRouteRecordRaw = Object.assign({}, route)
    // 如果路由是具体的页面，就做权限校验
    if (!route.children) {
      if (meta.showIn !== undefined && meta.showIn.indexOf(AuthorizeModel.SIMPLE) === -1) {
        continue
      }
      if (!meta.permission) {
        console.warn(`route ${route.path} no permission`)
        continue
      }
      const samePermission = Array.from(
        new Set([...meta.permission].filter((x) => permissionSet.has(x)))
      )
      if (samePermission.length === 0) {
        continue
      }
    }
    // 如果路由是菜单的中间节点，找有权限的子节点
    else {
      data.children = generateRoutesBySimpleAuthorizeModel(
        route.children,
        permissions,
        pathResolve(basePath, data.path)
      )
    }
    // 走到这里意味着菜单是有权限的页面或者可能有有权限的子节点
    // 如果是有权限的页面，或者是子节点有页面的中间节点，就push到res中
    if (!data.children || data.children.length > 0) {
      res.push(data as AppRouteRecordRaw)
    }
  }
  return res
}

// RBAC控制路由生成
export const generateRoutesByRBACAuthorizeModel = (
  routes: AppRouteRecordRaw[],
  menus: MenuInfo[]
): AppRouteRecordRaw[] => {
  const menuMap = new Map(menus.map((value) => [value.key, value]))
  return doGenerateRoutesByRBACAuthorizeModel(routes, menuMap)
}

export const doGenerateRoutesByRBACAuthorizeModel = (
  routes: AppRouteRecordRaw[],
  menuMap: Map<string, MenuInfo>
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const data: AppRouteRecordRaw = { ...route }
    const meta = route.meta
    // 如果路由是具体的页面，就做权限校验
    if (!route.children) {
      if (meta.showIn !== undefined && meta.showIn.indexOf(AuthorizeModel.RBAC) === -1) {
        continue
      }
      if (!menuMap.has(route.name)) {
        continue
      }
      // 如果是有权限的页面，就设置containerComponentKeys
      data.meta.containerComponentKeys = menuMap.get(route.name)?.innerComponentKeys
    }
    // recursive child routes
    else {
      data.children = doGenerateRoutesByRBACAuthorizeModel(route.children, menuMap)
    }
    // 走到这里意味着菜单是有权限的页面或者可能有有权限的子节点
    // 如果是有权限的页面，或者是子节点有页面的中间节点，就push到res中
    if (!data.children || data.children.length > 0) {
      res.push(data as AppRouteRecordRaw)
    }
  }
  return res
}

export const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  const childPath = path.startsWith('/') || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}

// 路由降级
export const flatMultiLevelRoutes = (routes: AppRouteRecordRaw[]) => {
  const modules: AppRouteRecordRaw[] = cloneDeep(routes)
  for (let index = 0; index < modules.length; index++) {
    const route = modules[index]
    if (!isMultipleRoute(route)) {
      continue
    }
    promoteRouteLevel(route)
  }
  return modules
}

// 层级是否大于2
const isMultipleRoute = (route: AppRouteRecordRaw) => {
  if (!route || !Reflect.has(route, 'children') || !route.children?.length) {
    return false
  }

  const children = route.children

  let flag = false
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (child.children?.length) {
      flag = true
      break
    }
  }
  return flag
}

// 生成二级路由
const promoteRouteLevel = (route: AppRouteRecordRaw) => {
  let router: Router | null = createRouter({
    routes: [route as RouteRecordRaw],
    history: createWebHashHistory()
  })

  const routes = router.getRoutes()
  addToChildren(routes, route.children || [], route)
  router = null

  route.children = route.children?.map((item) => omit(item, 'children'))
}

// 添加所有子菜单
const addToChildren = (
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteRecordRaw
) => {
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    const route = routes.find((item) => item.name === child.name)
    if (!route) {
      continue
    }
    routeModule.children = routeModule.children || []
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteRecordRaw)
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule)
    }
  }
}
