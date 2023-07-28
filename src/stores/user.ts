import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, post } from '@/logics/request'
import { ElMessageBox, ElMessage } from 'element-plus'
import { error } from '@/utils/logger'
import cryptojs from 'crypto-js'

function encryptPassword(password: string): string {
  return cryptojs.SHA1(password).toString()
}

export const useUserStore = defineStore('user', () => {
  const mySelf = ref<User>({ id: 0, username: '' })
  const showLogin = ref<boolean>(false)
  const inputLoginUsername = ref<string>('')
  const inputLoginPassword = ref<string>('')
  const loginLoading = ref<boolean>(false)
  const signupLoading = ref<boolean>(false)

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
          showLogin.value = false
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
        loginLoading.value = false
        inputLoginUsername.value = ''
        inputLoginPassword.value = ''
      })
  }

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
          }
        })
        .catch((err) => {
          error('/users/login error:', err)
          ElMessage('登出接口错误')
        })
    }
  }

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
    loginLoading,
    signupLoading,
    login,
    logout,
    signup,
  }
})
