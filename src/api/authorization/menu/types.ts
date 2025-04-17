import { CommonStatus, PageRequest } from '@/axios/types'
import { AppInfo } from '../appInfo/types'
import { FunctionGroupInfo } from '../function/group/types'

export interface MenuInfo {
  id: number
  no: string
  title: string
  componentKey: string
  staticPage: boolean
  parentNo: string
  appKey: string
  appInfo: AppInfo
  status: CommonStatus
  childrenMenus?: MenuInfo[]
  functionGroupInfos?: FunctionGroupInfo[]
  creator: string
  createTime: string
  updater: string
  updateTime: string
}

export interface MenuListRequest extends PageRequest {
  no?: string
  title?: string
  componentKey?: string
  parentNo?: string
  appKey?: string
  status?: CommonStatus
  notLeafNode?: boolean
  onlyLeafNode?: boolean
}

export interface MenuAddRequest {
  title: string
  componentKey: string
  staticPage: boolean
  parentNo: string
  appKey: string
}

export interface MenuUpdateRequest extends MenuAddRequest {
  id: number
  status: CommonStatus
}
