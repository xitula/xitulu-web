/**
 * 通用API请求函数
 */

import axios from 'axios'
import config from '../constants/config.json'
import { error } from '../utils/logger'

axios.defaults.baseURL = `${config.apiHost}:${config.apiPort}`

axios.interceptors.response.use((response) => {
  const { data } = response
  return data
})

export async function get(path: string, params?: object): Promise<object> {
  try {
    const data = await axios.get(path, params)
    return data
  } catch (err) {
    error(err)
    return Promise.reject(Error('axios错误'))
  }
}

export async function post(path: string, params: object): Promise<object> {
  try {
    const data = await axios.post(path, params)
    return data
  } catch (err) {
    error(err)
    return Promise.reject(Error('axios错误'))
  }
}

export async function put(path: string, params: object): Promise<object> {
  try {
    const data = await axios.put(path, params)
    return data
  } catch (err) {
    error(err)
    return Promise.reject(Error('axios错误'))
  }
}

export async function del(path: string): Promise<object> {
  try {
    const data = await axios.delete(path)
    return data
  } catch (err) {
    error(err)
    return Promise.reject(Error('axios错误'))
  }
}
