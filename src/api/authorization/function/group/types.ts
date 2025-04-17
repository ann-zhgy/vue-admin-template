import { AppInfo } from '@/api/authorization/appInfo/types'
import { FunctionInfo } from '../types'
import { CommonStatus, PageRequest } from '@/axios/types'
import { MenuInfo } from '../../login/types'

export enum GroupCallType {
  BY_SHOW = 'by-page',
  BY_BUTTON = 'by-button'
}

export interface FunctionGroupInfo {
  id: number
  no: string
  title: string
  appKey: string
  appInfo: AppInfo
  frontendPageNo: string
  frontendPage: MenuInfo
  groupCallType: GroupCallType
  status: CommonStatus
  functionInfos: FunctionInfo[]
  creator: string
  createTime: string
  updater: string
  updateTime: string
}

export interface FunctionGroupListRequest extends PageRequest {
  no?: string
  title?: string
  appKey?: string
  groupCallType?: GroupCallType
  status?: CommonStatus
}

export interface FunctionGroupAddRequest {
  title: string
  appKey: string
  groupCallType: GroupCallType
  status?: CommonStatus
  functionNos: string[]
}

export interface FunctionGroupUpdateRequest extends FunctionGroupAddRequest {
  id: number
}
