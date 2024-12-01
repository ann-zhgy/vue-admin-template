import request from '@/axios'
import type { LoginResponse, RBACModelUserInfo, SimpleUserInfo, LoginParam } from './types'

export const loginApi = (param: LoginParam): Promise<BaseResponse<LoginResponse>> => {
  return request.post({ url: '/mock/user/login', data: param })
}

export const loginOutApi = (): Promise<BaseResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

export const getUserInfoApi = (): Promise<BaseResponse<SimpleUserInfo | RBACModelUserInfo>> => {
  return request.get({ url: '/mock/user/info' })
}
