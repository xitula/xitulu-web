/**
 * 通用日志工具
 */
import { Logger } from 'tslog'

const logger = new Logger({ name: 'logger' })

/**
 * 信息日志
 * @param {unknown[]} args 日志参数
 */
export function info(...args: unknown[]) {
  logger.info(...args)
}

/**
 * 调试日志
 * @param {unknown[]} args 日志参数
 */
export function debug(...args: unknown[]) {
  logger.debug(...args)
}

/**
 * 警告日志
 * @param {unknown[]} args 日志参数
 */
export function warn(...args: unknown[]) {
  logger.warn(...args)
}

/**
 * 错误日志
 * @param {unknown[]} args 日志参数
 */
export function error(...args: unknown[]) {
  logger.error(...args)
}
