// 待办请求用数据
type ReqTodo = {
  // 待办ID
  id?: number
  // 用户ID
  uid?: number
  // 内容
  content: string
  // 描述
  description: string
  // 是否已完成
  done?: number
  // 创建日期
  // createDate: string
}

// 待办状态
type TodoStatus = {
  // 最后更新日期
  lastUpdateDate: string
  // 是否已完成
  done: boolean
  // 更新done的loading
  doneLoading: boolean
  // 是否展开
  spread: boolean
  // 是否编辑中
  editing: boolean
  // 提交编辑保存loading
  editSaveLoading: boolean
}

// 待办事项
type Todo = Required<Omit<ReqTodo, 'done'> & TodoStatus>

// 排序条件
type OrderBy = 'create-desc' | 'update-desc'

// 过滤条件
type FilterBy = 'all' | 'tobe' | 'done'
