import { AppInfo } from '@/api/authorization/appInfo/types'
import { RoleInfo } from '@/api/authorization/role/type'
import { CommonStatus, PageRequest } from '@/axios/types'

export interface UserListRequest extends PageRequest {
  username?: string
  phone?: string
  email?: string
  status?: CommonStatus
}

export interface UserUpdateRequest {
  id: number
  username?: string
  phone?: string
  email?: string
}

export interface UserBindRoleRequest {
  userId: number
  roleIds: number[]
}

export interface UserBindAppRequest {
  userId: number
  appKeys: string[]
}

export interface UserRolesRequest extends PageRequest {
  userId: number
  appKey: string
}

export interface UserRoleInfo {
  appInfo: AppInfo
  roleInfos: RoleInfo[]
}
