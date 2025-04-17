import request from '@/axios'
import { PageResult } from '@/axios/types'
import {
  UserBindAppRequest,
  UserBindRoleRequest,
  UserListRequest,
  UserRoleInfo,
  UserRolesRequest,
  UserUpdateRequest
} from './types'
import { RBACModelUserInfo } from '@/api/authorization/login/types'
import { RoleInfo } from '@/api/authorization/role/type'

export const userListApi = async (
  param: UserListRequest
): Promise<PageResult<RBACModelUserInfo>> => {
  return (await request.get({ url: '/user', params: param })).data
}

export const updateSelfApi = async (param: UserUpdateRequest) => {
  const { id, ...data } = param
  await request.put({ url: `/user/${id}`, data })
}

export const queryUserApi = async (id: number): Promise<RBACModelUserInfo> => {
  return (await request.get({ url: `/user/${id}` })).data
}

export const disableUserApi = async (id: number) => {
  await request.post({ url: `/user/${id}/disable` })
}

export const enableUserApi = async (id: number) => {
  await request.post({ url: `/user/${id}/enable` })
}

export const queryUserRolesApi = async (id: number): Promise<UserRoleInfo[]> => {
  return (await request.get({ url: `/user/${id}/roles` })).data
}

// 暂时没有用到
export const queryUserAppRolesApi = async (
  param: UserRolesRequest
): Promise<PageResult<RoleInfo>> => {
  const { userId, appKey, ...requestParam } = param
  return (await request.get({ url: `/user/${userId}/${appKey}/roles`, params: requestParam })).data
}

export const bindUserRolesApi = async (param: UserBindRoleRequest) => {
  const { userId, ...requestParam } = param
  await request.post({ url: `/user/${userId}/bind-role`, data: requestParam })
}

export const unbindUserRolesApi = async (param: UserBindRoleRequest) => {
  const { userId, ...requestParam } = param
  await request.post({ url: `/user/${userId}/unbind-role`, data: requestParam })
}

export const bindUserAppsApi = async (param: UserBindAppRequest) => {
  const { userId, ...requestParam } = param
  await request.post({ url: `/user/${userId}/bind-app`, data: requestParam })
}

export const unbindUserAppsApi = async (param: UserBindAppRequest) => {
  const { userId, ...requestParam } = param
  await request.post({ url: `/user/${userId}/unbind-app`, data: requestParam })
}
