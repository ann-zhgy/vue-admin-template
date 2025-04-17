import { CommonStatus, PageRequest } from '@/axios/types'
import { AppInfo } from '../appInfo/types'

export declare type RoleInfo = {
  id: number
  no: string
  name: string
  nameZh: string
  description: string
  appKey: string
  appInfo: AppInfo
  menuNos: string[]
  status: CommonStatus
  creator: string
  createTime: string
  updater: string
  updateTime: string
}

export interface RoleListRequest extends PageRequest {
  no?: string
  name?: string
  nameZh?: string
  appKey?: string
  status?: CommonStatus
}

export interface RoleAddRequest {
  name: string
  nameZh: string
  description: string
  appKey: string
  menuNos: string[]
}

export interface RoleUpdateRequest extends RoleAddRequest {
  id: number
  no: string
}

export interface RoleBindMenuRequest {
  id: number
  functionGroupNos: string[]
}
