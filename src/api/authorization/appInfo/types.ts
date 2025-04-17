import { CommonStatus, PageRequest } from '@/axios/types'

export interface AppInfo {
  id: number
  appKey: string
  appName: string
  description: string
  accessControlBy: AccessControlType
  grantAccessPermissionBy?: GrantAccessPermissionType
  appType: AppType[]
  status: CommonStatus
  creator: string
  createTime: Date
  updater: string
  updateTime: Date
}

export interface AppInfoListRequest extends PageRequest {
  appKey?: string
  appName?: string
  accessControlBy?: AccessControlType
  grantAccessPermissionBy?: GrantAccessPermissionType
  appType?: AppType[]
  status?: CommonStatus
}

export interface AppInfoAddRequest {
  appKey: string
  appName: string
  description: string
  accessControlBy: AccessControlType
  grantAccessPermissionBy?: GrantAccessPermissionType
  appType: AppType[]
}

export interface AppInfoUpdateRequest extends AppInfoAddRequest {
  id: number
}

export enum AppType {
  BACKEND = 'backend',
  WEB = 'web',
  MINI_PROGRAM = 'mini-program',
  ANDROID = 'android',
  IOS = 'ios'
}

export enum AccessControlType {
  BY_RBAC = 'by-rbac',
  BY_SELF = 'by-self'
}

export enum GrantAccessPermissionType {
  AUTO = 'auto',
  MANUAL = 'manual'
}
