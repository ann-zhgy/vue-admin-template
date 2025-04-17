import request from '@/axios'
import { PageResult } from '@/axios/types'
import { MenuInfo, MenuAddRequest, MenuListRequest, MenuUpdateRequest } from './types'

export const queryMenuApi = async (id: number): Promise<MenuInfo> => {
  return (await request.get({ url: `/menu/${id}` })).data
}

export const queryMenuListApi = async (params: MenuListRequest): Promise<PageResult<MenuInfo>> => {
  return (await request.get({ url: '/menu', params })).data
}

export const queryAppKeyMenuListApi = async (appKey: string): Promise<MenuInfo[]> => {
  return (await request.get({ url: '/menu/appKey-menus', params: { appKey } })).data
}

export const createMenuApi = async (params: MenuAddRequest) => {
  return (await request.post({ url: '/menu', data: params })).data
}

export const updateMenuApi = async (params: MenuUpdateRequest) => {
  const { id, ...data } = params
  return (await request.put({ url: `/menu/${id}`, data })).data
}

export const deleteMenuApi = async (id: number) => {
  return (await request.delete({ url: `/menu/${id}` })).data
}

export const enableMenuApi = async (id: number) => {
  return (await request.post({ url: `/menu/${id}/enable` })).data
}

export const disableMenuApi = async (id: number) => {
  return (await request.post({ url: `/menu/${id}/disable` })).data
}

export const menuIsLeafApi = async (id: number) => {
  return (await request.get({ url: `/menu/${id}/is-leaf` })).data
}
