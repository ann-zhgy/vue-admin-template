import { pathResolve } from '@/utils/routerHelper'
import type { RouteMeta } from 'vue-router'

export const filterBreadcrumb = (
  routes: AppRouteRecordRaw[],
  parentPath = ''
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const meta = route?.meta as RouteMeta
    if (meta.hidden && !meta.canTo) {
      continue
    }

    const data: AppRouteRecordRaw = { ...route }

    data.path = pathResolve(parentPath, data.path)

    if (data.children) {
      data.children = filterBreadcrumb(data.children, data.path)
    }
    if (data) {
      res.push(data)
    }
  }
  return res
}
