import request from '@/axios'
import type {
  LoginResponse,
  RBACModelUserInfo,
  SimpleUserInfo,
  LoginPasswordRequest,
  LoginCaptchaRequest,
  RegisterRequest,
  SendCaptchaRequest,
  UpdateSelfPasswordRequest,
  UpdatePasswordRequest
} from './types'
import { encryptMd5 } from '@/utils/encrypt'
import { AuthorizeModel, useAppStore } from '@/store/modules/app'

export const registerApi = async (param: RegisterRequest) => {
  const temp = { ...param }
  temp.password = encryptMd5(temp.password!)
  await request.post({ url: 'register', data: temp })
}

export const sendCaptchaApi = async (param: SendCaptchaRequest) => {
  await request.post({ url: 'send-captcha', data: param })
}

export const loginByPasswordApi = async (param: LoginPasswordRequest): Promise<LoginResponse> => {
  const temp = { ...param }
  temp.password = encryptMd5(temp.password!)
  const appStore = useAppStore()
  if (appStore.authorizeModel === AuthorizeModel.RBAC) {
    temp.appKey = import.meta.env.VITE_APP_KEY
  }
  return (await request.post({ url: '/login-by-password', data: temp })).data
}

export const loginByCapthaApi = async (param: LoginCaptchaRequest): Promise<LoginResponse> => {
  const temp = { ...param }
  const appStore = useAppStore()
  if (appStore.authorizeModel === AuthorizeModel.RBAC) {
    temp.appKey = import.meta.env.VITE_APP_KEY
  }
  return (await request.post({ url: '/login-by-captcha', data: temp })).data
}

export const logoutApi = async () => {
  await request.post({ url: '/user/logout' })
}

export const getSelfInfoApi = async (): Promise<SimpleUserInfo | RBACModelUserInfo> => {
  const appStore = useAppStore()
  if (appStore.authorizeModel === AuthorizeModel.RBAC) {
    return (
      await request.get({
        url: '/user/base-info',
        params: { queryMenus: true, appKey: import.meta.env.VITE_APP_KEY }
      })
    ).data
  }
  return (await request.get({ url: '/user/base-info' })).data
}

export const updateSelfPasswordApi = async (param: UpdateSelfPasswordRequest) => {
  await request.post({ url: '/user/update-password', data: param })
}

export const updatePasswordApi = async (param: UpdatePasswordRequest) => {
  await request.post({ url: '/update-password', data: param })
}
