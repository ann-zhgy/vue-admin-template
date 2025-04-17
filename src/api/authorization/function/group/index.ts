import request from '@/axios'
import {
  FunctionGroupInfo,
  FunctionGroupAddRequest,
  FunctionGroupListRequest,
  FunctionGroupUpdateRequest
} from './types'
import { PageResult } from '@/axios/types'

export const queryFunctionGroupApi = async (id: number): Promise<FunctionGroupInfo> => {
  return (await request.get({ url: `/function/group/${id}` })).data
}

export const queryFunctionGroupListApi = async (
  param: FunctionGroupListRequest
): Promise<PageResult<FunctionGroupInfo>> => {
  return (await request.get({ url: '/function/group', params: param })).data
}

export const createFunctionGroupApi = async (param: FunctionGroupAddRequest) => {
  return (await request.post({ url: '/function/group', data: param })).data
}

export const updateFunctionGroupApi = async (param: FunctionGroupUpdateRequest) => {
  const { id, ...data } = param
  return (await request.put({ url: `/function/group/${id}`, data })).data
}

export const deleteFunctionGroupApi = async (id: number) => {
  return (await request.delete({ url: `/function/group/${id}` })).data
}

export const enableFunctionGroupApi = async (id: number) => {
  return (await request.post({ url: `/function/group/${id}/enable` })).data
}

export const disableFunctionGroupApi = async (id: number) => {
  return (await request.post({ url: `/function/group/${id}/disable` })).data
}
