import request from '@/axios'
import { PageResult } from '@/axios/types'
import { RoleAddRequest, RoleInfo, RoleListRequest, RoleUpdateRequest } from './type'
import { RBACModelUserInfo } from '../login/types'

export const queryRoleApi = async (id: number): Promise<RoleInfo> => {
  return (await request.get({ url: `/role/${id}` })).data
}

export const queryRoleListApi = async (params: RoleListRequest): Promise<PageResult<RoleInfo>> => {
  return (await request.get({ url: '/role', params })).data
}

export const createRoleApi = async (params: RoleAddRequest) => {
  await request.post({ url: '/role', data: params })
}

export const updateRoleApi = async (params: RoleUpdateRequest) => {
  const { id, ...data } = params
  await request.put({ url: `/role/${id}`, data })
}

export const deleteRoleApi = async (id: number) => {
  await request.delete({ url: `/role/${id}` })
}

export const roleExistUserApi = async (id: number): Promise<boolean> => {
  return (await request.get({ url: `/role/${id}/exist-user` })).data
}

export const queryRoleUsersApi = async (id: number): Promise<PageResult<RBACModelUserInfo>> => {
  return (await request.get({ url: `/role/${id}/users` })).data
}

export const enableRoleApi = async (id: number) => {
  await request.post({ url: `/role/${id}/enable` })
}

export const disableRoleApi = async (id: number) => {
  await request.post({ url: `/role/${id}/disable` })
}
