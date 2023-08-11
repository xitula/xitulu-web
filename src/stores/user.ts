import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, post } from '@/logics/request'
import { ElMessageBox, ElMessage } from 'element-plus'
import { error } from '@/utils/logger'
import cryptojs from 'crypto-js'

function encryptPassword(password: string): string {
  return cryptojs.SHA256(password).toString()
}

// 配置userStore
export const useUserStore = defineStore('user', () => {
  // 当前用户信息
  const mySelf = ref<User>({ id: 0, username: '' })
  // 是否显示登录弹层
  const showLogin = ref<boolean>(false)
  // 输入的用户名
  const inputLoginUsername = ref<string>('')
  // 输入的密码
  const inputLoginPassword = ref<string>('')
  // 登录弹层提示信息
  const loginHint = ref<string>('')
  // 登录中loading
  const loginLoading = ref<boolean>(false)
  // 注册中loading
  const signupLoading = ref<boolean>(false)

  // 登录
  function login() {
    const pwd = encryptPassword(inputLoginPassword.value)
    const params = {
      username: inputLoginUsername.value,
      password: pwd,
    }
    post('/users/login', params)
      .then((res) => {
        const { code, message, data } = Object(res)
        if (code !== 0) {
          ElMessageBox.alert(message, '登录提示', { confirmButtonText: '确定' })
        } else {
          const { token } = Object(data)
          mySelf.value = data
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('mySelf', JSON.stringify(data))
          showLogin.value = false
          ElMessage({
            type: 'success',
            message: '登录成功',
          })
        }
      })
      .catch((err) => {
        error('/users/login error:', err)
        ElMessage({
          message: '登录接口错误',
          type: 'error',
        })
      })
      .finally(() => {
        loginHint.value = ''
        loginLoading.value = false
        inputLoginUsername.value = ''
        inputLoginPassword.value = ''
      })
  }

  // 登出
  function logout() {
    const { id = 0 } = Object(mySelf.value)
    if (id) {
      const params = { id }
      get('/users/logout', { params })
        .then((res) => {
          const { code, message } = Object(res)
          if (code !== 0) {
            ElMessage({
              message,
              type: 'warning',
            })
          } else {
            mySelf.value = { id: 0, username: '' }
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('mySelf')
          }
        })
        .catch((err) => {
          error('/users/login error:', err)
          ElMessage('登出接口错误')
        })
    }
  }

  // 注册
  function signup(form: SignupForm) {
    const params = { ...form }
    delete params.verifyPassword
    params.password = encryptPassword(params.password)
    signupLoading.value = true
    return post('/users', params)
      .then((res) => {
        const { code, message, data } = Object(res)
        if (code !== 0) {
          ElMessage({
            message,
            type: 'warning',
          })
        } else {
          const { token } = Object(data)
          // 注册成功后直接变为登录状态
          mySelf.value = data
          sessionStorage.setItem('token', token)
        }
      })
      .catch((err) => {
        error('/users error:', err)
        ElMessage('注册接口错误')
      })
      .finally(() => {
        signupLoading.value = false
      })
  }

  return {
    mySelf,
    showLogin,
    inputLoginUsername,
    inputLoginPassword,
    loginHint,
    loginLoading,
    signupLoading,
    login,
    logout,
    signup,
  }
})
