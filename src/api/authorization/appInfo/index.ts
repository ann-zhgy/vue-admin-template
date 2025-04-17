import request from '@/axios'
import { PageResult } from '@/axios/types'
import { AppInfo, AppInfoAddRequest, AppInfoListRequest, AppInfoUpdateRequest } from './types'

export const queryAppInfoApi = async (id: number): Promise<AppInfo> => {
  return (await request.get({ url: `/app-info/${id}` })).data
}

export const queryUserAppInfoApi = async (username: string): Promise<AppInfo[]> => {
  return (await request.get({ url: `/app-info/user`, params: { username } })).data
}

export const queryAppInfoListApi = async (
  params: AppInfoListRequest
): Promise<PageResult<AppInfo>> => {
  return (await request.get({ url: '/app-info', params })).data
}

export const createAppInfoApi = async (params: AppInfoAddRequest) => {
  return (await request.post({ url: '/app-info', data: params })).data
}

export const updateAppInfoApi = async (params: AppInfoUpdateRequest) => {
  const { id, ...data } = params
  return (await request.put({ url: `/app-info/${id}`, data })).data
}

export const deleteAppInfoApi = async (id: number) => {
  return (await request.delete({ url: `/app-info/${id}` })).data
}

export const enableAppInfoApi = async (id: number) => {
  return (await request.post({ url: `/app-info/${id}/enable` })).data
}

export const disableAppInfoApi = async (id: number) => {
  return (await request.post({ url: `/app-info/${id}/disable` })).data
}
