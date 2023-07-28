import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, post } from '@/logics/request'
import { ElMessageBox, ElMessage } from 'element-plus'
import { error } from '@/utils/logger'
import cryptojs from 'crypto-js'

export const useUserStore = defineStore('user', () => {
  const mySelf = ref<User>({ id: 0, username: '' })
  const showLogin = ref<boolean>(false)
  const inputLoginUsername = ref<string>('')
  const inputLoginPassword = ref<string>('')
  const loginLoading = ref<boolean>(false)

  function login() {
    const pwd = cryptojs.SHA1(inputLoginPassword.value).toString()
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

  return { mySelf, showLogin, inputLoginUsername, inputLoginPassword, loginLoading, login, logout }
})
