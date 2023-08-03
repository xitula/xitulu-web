/**
 * 通用API请求函数
 */

import axios from 'axios'
import config from '../constants/config.json'
import { error } from '../utils/logger'

// 配置地址与端口
axios.defaults.baseURL = `${config.apiHost}:${config.apiPort}`

// 设置通用响应拦截器
axios.interceptors.response.use((response) => {
  const { data } = response
  return data
})

/**
 * 通用GET请求函数
 * @export
 * @param {string} path 路径
 * @param {object} [params] 参数列表
 * @returns {Promise<object>}
 */
export async function get(path: string, params?: object): Promise<object> {
  try {
    const data = await axios.get(path, params)
    return data
  } catch (err) {
    error('Axios error:', err)
    return Promise.reject(Error('axios错误'))
  }
}

/**
 * 通用POST请求函数
 * @export
 * @param {string} path 路径
 * @param {object} params 参数列表
 * @returns {Promise<object>}
 */
export async function post(path: string, params: object): Promise<object> {
  try {
    const data = await axios.post(path, params)
    return data
  } catch (err) {
    error('Axios error:', err)
    return Promise.reject(Error('axios错误'))
  }
}

/**
 * 通用PUT请求函数
 * @export
 * @param {string} path 路径
 * @param {object} params 参数列表
 * @returns {Promise<object>}
 */
export async function put(path: string, params: object): Promise<object> {
  try {
    const data = await axios.put(path, params)
    return data
  } catch (err) {
    error('Axios error:', err)
    return Promise.reject(Error('axios错误'))
  }
}

/**
 * 通用DELETE请求函数
 * @export
 * @param {string} path 路径
 * @returns {Promise<object>}
 */
export async function del(path: string): Promise<object> {
  try {
    const data = await axios.delete(path)
    return data
  } catch (err) {
    error('Axios error:', err)
    return Promise.reject(Error('axios错误'))
  }
}
