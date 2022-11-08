export interface LoginParams {
  username: string
  password: string
}

interface RoleInfo {
  roleName: string
  value: string
}

export interface LoginResultModel {
  userId: string
  token: string
  role: RoleInfo[]
}
