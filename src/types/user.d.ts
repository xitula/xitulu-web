type User = {
  id: number
  username: string
  nickname?: string
  email?: string
  status?: string
  token?: string
}

type SignupForm = {
  nickname?: string
  username: string
  password: string
  verifyPassword?: string
  email?: string
}
