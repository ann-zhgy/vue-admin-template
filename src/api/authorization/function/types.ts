import { CommonStatus, PageRequest } from '@/axios/types'
import { AppInfo } from '../appInfo/types'

export interface FunctionInfo {
  id: number
  no: string
  title: string
  requestMethod: AxiosMethod
  requestUrl: string
  appKey: string
  appInfo: AppInfo
  status: CommonStatus
  creator: string
  createTime: Date
  updater: string
  updateTime: Date
}

export interface FunctionListRequest extends PageRequest {
  no?: string
  title?: string
  requestMethod?: AxiosMethod
  requestUrl?: string
  appKey?: string
  status?: CommonStatus
}

export interface FunctionAddRequest {
  title: string
  requestMethod: AxiosMethod
  requestUrl: string
  appKey: string
}

export interface FunctionUpdateRequest extends FunctionAddRequest {
  id: number
}
