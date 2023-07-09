/**
 * 命令行模拟器相关逻辑文件
 */

import * as C from '../constants/common'
import { routes } from '../router/index'
import { useHeaderStore } from '../stores/header'

export default class CommandLineSimulator {
  // 命令白名单
  private commandWhiteListMap = new Map<string, Function>([['go', this.cmdGo.bind(this)]])

  // go命令的路由名称白名单
  private cmdGoWhiteList = routes.map((elem) => {
    return elem.name
  })

  /**
   * 分解命令字符串
   * 
   * @param {string} command 完整的命令字符串
   * @return {CmdList} 分解后的命令列表
   */
  private disassembleCommand(command: string): CmdList {
    const fmtCmd = command.trim()
    const list = fmtCmd.split(' ')
    return list
  }

  /**
   * 执行go命令
   * 
   * @param { string } name 路由名称
   * @return { Result } 执行结果
   */
  private cmdGo(name: string): Result {
    if (this.cmdGoWhiteList.includes(name)) {
      const headerStore = useHeaderStore()
      headerStore.changeMenu(name)
      return C.ExecSuccess
    }
    return { code: 1, message: '无效的路由名称' }
  }

  /**
   * 尝试匹配并执行相关命令
   * 
   * @param { string } 完整的命令字符串
   * @return { Result } 匹配是否成功
   */
  public matchCommand(command: string): Result {
    const cmdList = this.disassembleCommand(command)
    if (!this.commandWhiteListMap.has(cmdList[0])) return C.ExecFail
    else return C.ExecSuccess
  }

  /**
   * 尝试匹配并执行命令
   * 
   * @param {string}command 完整的命令字符串
   * @return { Result } 执行结果
   */
  public execCommand(command: string): Result {
    const cmdList = this.disassembleCommand(command)
    const cmd = cmdList[0]
    if (!this.commandWhiteListMap.has(cmd)) return C.ExecFail
    const func = this.commandWhiteListMap.get(cmd)
    if (typeof func === 'function') {
      return func(cmdList[1])
    }
    return C.ExecFail
  }
}
