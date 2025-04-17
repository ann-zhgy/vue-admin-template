import request from '@/axios'
import { PageResult } from '@/axios/types'
import { SimpleUserInfo } from '../../login/types'
import { SimplePermission, UserListRequest, UserUpdateRequest } from './types'

export const userListApi = async (param: UserListRequest): Promise<PageResult<SimpleUserInfo>> => {
  return (await request.get({ url: '/user', params: param })).data
}

export const updateSelfApi = async (param: UserUpdateRequest) => {
  await request.put({ url: '/user', data: param })
}

export const queryUserApi = async (id: number): Promise<SimpleUserInfo> => {
  return (await request.get({ url: `/user/${id}` })).data
}

export const disableUserApi = async (id: number) => {
  await request.post({ url: `/user/${id}/disable` })
}

export const enableUserApi = async (id: number) => {
  await request.post({ url: `/user/${id}/enable` })
}

export const updateUserPermissionApi = async (id: number, permissions: SimplePermission[]) => {
  await request.post({ url: `/user/${id}/permission`, data: { permissions } })
}
