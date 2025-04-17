import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { NO_LOGIN_CODE, SUCCESS_CODE, TOKEN_EXPIRE_CODE, TRANSFORM_REQUEST_DATA } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { objToFormData } from '@/utils'

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  } else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data'
  ) {
    config.data = objToFormData(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        const paramValue = config.params[key]
        if (Array.isArray(paramValue)) {
          url += `${key}=${encodeURIComponent(qs.stringify(config.params[key]))}&`
        } else {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = <T>(
  response: AxiosResponse<BaseResponse<T>>
): AxiosResponse<BaseResponse<T>> => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code === SUCCESS_CODE) {
    return response
  } else {
    ElMessage.error(response?.data?.message)
    if (response?.data?.code === NO_LOGIN_CODE || response?.data?.code === TOKEN_EXPIRE_CODE) {
      const userStore = useUserStoreWithOut()
      userStore.logout()
    }
    throw new Error(response?.data?.message)
  }
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
