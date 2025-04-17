import request from '@/axios'
import { PageResult } from '@/axios/types'
import {
  FunctionAddRequest,
  FunctionInfo,
  FunctionListRequest,
  FunctionUpdateRequest
} from './types'

export const queryFunctionApi = async (id: number): Promise<FunctionInfo> => {
  return (await request.get({ url: `/function/${id}` })).data
}

export const queryFunctionListApi = async (
  params: FunctionListRequest
): Promise<PageResult<FunctionInfo>> => {
  return (await request.get({ url: '/function', params })).data
}

export const createFunctionApi = async (params: FunctionAddRequest) => {
  return (await request.post({ url: '/function', data: params })).data
}

export const updateFunctionApi = async (params: FunctionUpdateRequest) => {
  const { id, ...data } = params
  return (await request.put({ url: `/function/${id}`, data })).data
}

export const deleteFunctionApi = async (id: number) => {
  return (await request.delete({ url: `/function/${id}` })).data
}

export const enableFunctionApi = async (id: number) => {
  return (await request.post({ url: `/function/${id}/enable` })).data
}

export const disableFunctionApi = async (id: number) => {
  return (await request.post({ url: `/function/${id}/disable` })).data
}
