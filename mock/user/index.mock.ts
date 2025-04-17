import { SimpleUserInfo } from '@/api/authorization/login/types'
import { SimplePermission } from '@/api/authorization/user/simple/types'
import { CommonStatus } from '@/axios/types'
import { SUCCESS_CODE } from '@/constants'

const timeout = 1000

const simpleUserAdmin: SimpleUserInfo = {
  username: 'admin',
  permission: [SimplePermission.ADMIN, SimplePermission.BASIC],
  id: 1,
  status: CommonStatus.ENABLE
}
const simpleUserTest: SimpleUserInfo = {
  username: 'test',
  permission: [SimplePermission.BASIC],
  id: 2,
  status: CommonStatus.ENABLE
}

const simpleUserMap: Map<string, { token: string; userInfo: SimpleUserInfo }> = new Map([
  ['admin', { token: 'admin-token', userInfo: simpleUserAdmin }],
  ['test', { token: 'test-token', userInfo: simpleUserTest }]
])

const simpleTokenUserMap: Map<string, SimpleUserInfo> = new Map([
  ['admin-token', simpleUserAdmin],
  ['test-token', simpleUserTest]
])

export default [
  // 登录接口
  {
    url: '/mock/user/login',
    method: 'post',
    timeout,
    response: ({ body }) => {
      const data = body
      if (!simpleUserMap.has(data.username)) {
        return {
          code: '50001',
          message: '账号不存在'
        }
      }
      return {
        code: SUCCESS_CODE,
        message: 'success',
        data: { token: simpleUserMap.get(data.username)?.token }
      }
    }
  },
  // 退出接口
  {
    url: '/mock/user/loginOut',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: 'success',
        data: null
      }
    }
  },
  // mock/user/info
  {
    url: '/mock/user/info',
    method: 'get',
    timeout,
    response: (request: any) => {
      const token = request.headers.token
      if (simpleTokenUserMap.has(token)) {
        return {
          code: SUCCESS_CODE,
          message: 'success',
          data: simpleTokenUserMap.get(token)
        }
      }
      return {
        code: '50002',
        message: 'token无效'
      }
    }
  }
]
