import { CommonStatus, PageRequest } from '@/axios/types'

export interface UserListRequest extends PageRequest {
  username?: string
  phone?: string
  email?: string
  status?: CommonStatus
}

export interface UserUpdateRequest {
  username?: string
  phone?: string
  email?: string
}

export interface UpdateSelfPasswordRequest {
  id: number
  originPassword: string
  newPassword: string
}

export enum SimplePermission {
  BASIC = 'basic',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super-admin'
}
