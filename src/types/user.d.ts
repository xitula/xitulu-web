// 用户信息
type User = {
  // 用户ID
  id: number
  // 用户名
  username: string
  // 昵称
  nickname?: string
  // 邮箱地址
  email?: string
  // 状态
  status?: string
  // 登录token
  token?: string
}

// 注册表单
type SignupForm = {
  // 昵称
  nickname?: string
  // 用户名
  username: string
  // 密码
  password: string
  // 校验密码
  verifyPassword?: string
  // 邮箱地址
  email: string
}
