/**
 * 请求成功状态码
 */
export const SUCCESS_CODE = '00000'

/**
 * 账号未登录状态码
 */
export const NO_LOGIN_CODE = '10001'

/**
 * token 过期状态码
 */
export const TOKEN_EXPIRE_CODE = '10002'

/**
 * 请求contentType
 */
export const CONTENT_TYPE: AxiosContentType = 'application/json'

/**
 * 请求超时时间
 */
export const REQUEST_TIMEOUT = 60000

/**
 * 不重定向白名单，实际上是不需要登录就可以访问的白名单
 */
export const NO_REDIRECT_WHITE_LIST = ['/login']

/**
 * 不重置路由白名单
 */
export const NO_RESET_WHITE_LIST = ['Redirect', 'Login', 'NoFind', 'Root']

/**
 * 表格默认过滤列设置字段
 */
export const DEFAULT_FILTER_COLUMN = ['expand', 'selection']

/**
 * 是否根据headers->content-type自动转换数据格式
 */
export const TRANSFORM_REQUEST_DATA = true

export enum AdminDialogType {
  ADD = 'add',
  EDIT = 'edit',
  VIEW = 'view'
}
