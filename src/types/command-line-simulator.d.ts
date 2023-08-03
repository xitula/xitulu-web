// 命令行模拟器接口
interface CommandLineSimulator {
  // 命令列表
  commandWhiteListMap: Map<string, Function>
  // go命令白名单
  cmdGoWhiteList: Array<string>
  // 分解输入的命令字符串方法
  disassembleCommand(command: string): CmdList
  // go命令处理方法
  cmdGo(name: string): Result
  // 匹配命令方法
  matchCommand(command: string): Result
  // 执行命令方法
  execCommand(command: string): Result
}

// 命令列表
type CmdList = Array<string>
