export type LoginParam = {
  username?: string
  email?: string
  password?: string
  phone?: string
  verificationCode?: string
}

export type LoginResponse = {
  token: string
}

export type SimpleUserInfo = {
  username: string
  email?: string
  phone?: string
  avatar?: string
  permissions: string[]
}

export type MenuInfo = {
  key: string
  title: string
}

export type RBACModelUserInfo = {
  username: string
  email?: string
  phone?: string
  avatar?: string
  roles: string[]
  menus: MenuInfo[]
}
