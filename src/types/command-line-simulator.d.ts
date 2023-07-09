interface CommandLineSimulator {
  commandWhiteListMap: Map<string, Function>
  cmdGoWhiteList: Array<string>
  disassembleCommand(command: string): CmdList
  cmdGo(name: string): Result
  matchCommand(command: string): Result
  execCommand(command: string): Result
}

type CmdList = Array<string>
