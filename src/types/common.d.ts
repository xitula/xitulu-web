/**
 * 通用数据类型定义文件
 */

// 函数执行结果类型
type Result = {
  // 错误码
  code: number
  // 错误消息
  message: string
  // 返回结果数据
  data?: object
}

// 通用API返回结果
type Res = {
  // 错误码
  code: number
  // 错误消息
  message: string
  // 返回结果数据
  data?: object
}
