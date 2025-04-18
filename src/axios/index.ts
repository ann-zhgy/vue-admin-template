import service from './service'
import { CONTENT_TYPE } from '@/constants'

const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType } = option
  return service.request({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      appkey: import.meta.env.VITE_APP_KEY,
      ...headers
    }
  })
}

export default {
  get: <T = any>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<BaseResponse<T>>
  },
  post: <T = any>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<BaseResponse<T>>
  },
  delete: <T = any>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<BaseResponse<T>>
  },
  put: <T = any>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<BaseResponse<T>>
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
