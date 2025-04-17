import { CommonStatus } from '@/axios/types'
import { SimplePermission } from '../user/simple/types'

export type RegisterRequest = {
  username: string
  password: string
  phone?: string
  email?: string
  iAgree?: string
}

export type SendCaptchaRequest = {
  phone?: string
  email?: string
}

export type UpdatePasswordRequest = {
  username: string
  captcha: string
  newPassword: string
}

export type UpdateSelfPasswordRequest = {
  id: number
  originPassword: string
  newPassword: string
}

export type LoginPasswordRequest = {
  username?: string
  password?: string
  appKey?: string
}

export type LoginCaptchaRequest = {
  username?: string
  captcha?: string
  appKey?: string
}

export type LoginResponse = {
  token: string
}

export type SimpleUserInfo = {
  id: number
  username: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  permission: SimplePermission[]
  status: CommonStatus
}

export type MenuInfo = {
  key: string
  title: string
  innerComponentKeys?: Set<string>
}

export type RBACModelUserInfo = {
  id: number
  username: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  status: CommonStatus
  menus: MenuInfo[]
}
