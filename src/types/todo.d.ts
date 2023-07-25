type ReqTodo = {
  id?: number // ID
  contant: string // 内容
  description: string // 描述
  done?: number // 是否已完成
  // createDate: string // 创建日期
}

type TodoStatus = {
  lastUpdateDate: string // 最后更新日期
  done: boolean // 是否已完成
  doneLoading: boolean // 更新done的loading
  spread: boolean // 是否展开
  editing: boolean // 是否编辑中
  editSaveLoading: boolean // 提交编辑保存loading
}

// 待办事项
type Todo = Omit<ReqTodo, 'done'> & TodoStatus
