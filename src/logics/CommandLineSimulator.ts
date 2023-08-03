/**
 * 命令行模拟器相关逻辑文件
 */

import * as C from '../constants/common'
import { routes } from '../router/index'
import { useHeaderStore } from '../stores/header'
import { useFooterStore } from '../stores/footer'

export default class CommandLineSimulator {
  // 命令白名单
  private commandWhiteListMap = new Map<string, Function>([
    ['go', this.cmdGo.bind(this)],
    ['go1', () => C.ExecSuccess], // TODO 测试数据，下同，用后删除
    ['asdf', () => C.ExecSuccess],
    ['asd', () => C.ExecSuccess],
    ['asc', () => C.ExecSuccess],
    ['asb', () => C.ExecSuccess],
  ])

  // go命令的路由名称白名单
  private cmdGoWhiteList = routes.map((elem) => {
    return elem.name
  })

  /**
   * 分解命令字符串
   * @private
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
   * @private
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
   * 尝试列出匹配的命令
   * @private
   * @param {string} cmd 命令
   * @return {string[]} 匹配成功的命令列表
   */
  private regTestCommand(cmd: string): string[] {
    const whiteList = Array.from(this.commandWhiteListMap.keys())
    const reg = new RegExp(`^${cmd}`)
    const result = whiteList.filter((elem) => reg.test(elem))

    return result.length > 0 ? result : whiteList
  }

  /**
   * 尝试匹配并将命令输出到footerStore
   * @param { string } command 完整的命令字符串
   */
  public matchCommand(command: string): void {
    const footerStore = useFooterStore()
    const cmdList = this.disassembleCommand(command)
    const cmd = cmdList[0]
    const result = this.regTestCommand(cmd)
    footerStore.setHints(result)
  }

  /**
   * 尝试匹配并执行命令
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
