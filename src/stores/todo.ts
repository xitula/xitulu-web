import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { get, post, put, del } from '../logics/request'
import { error } from '../utils/logger'
import { useUserStore } from './user'

/**
 * 格式化列表数据
 * @param {object[]} todo 接口返回的待办列表
 * @returns {Todo[]}
 */
function formatTodos(todo: Todo[]): Todo[] {
  return todo.map((item) => {
    const { done, ...others } = Object(item)
    return {
      done: Boolean(done),
      doneLoading: false,
      spread: false,
      editing: false,
      editSaveLoading: false,
      ...others,
    }
  })
}

/**
 * 还原本地待办为请求格式
 * @param {Todo} todo
 * @returns
 */
function revertTodo(todo: Todo): object {
  const { id, content, description, done: numDone } = todo
  const done = Number(numDone)
  return { id, content, description, done }
}

/**
 * 重置全部编辑中状态为默认关闭
 * @param {Todo[]} todos 待办列表
 */
function resetEditing(todos: Todo[]) {
  todos.forEach((item) => {
    item.editing = false
  })
}

/**
 * 新增待办
 * @param {ReqTodo} params 请求用待办数据
 * @returns {Promise}
 */
function addTodo(params: ReqTodo) {
  return post('/todo', params)
    .then((res) => {
      const { code, message } = Object(res)
      if (code !== 0) {
        return Promise.reject(Error('addTodo接口错误:', message))
      }
    })
    .catch((err) => {
      error('addTodoError:', err)
    })
}

/**
 * 更新待办数据
 * @param {ReqTodo} params 请求用待办数据
 * @returns {Promise}
 */
function updateTodo(params: ReqTodo): Promise<void> {
  return put(`/todo`, params)
    .then((res) => {
      const { code, message } = Object(res)
      if (code !== 0) {
        error('更新待办接口错误:', message)
        return Promise.reject(Error(message))
      }
    })
    .catch((err) => {
      error('网络错误:', err)
    })
}

// 配置待办store
export const useTodoStore = defineStore('todo', () => {
  const userStore = useUserStore()
  // 删除中loading
  const deleteLoading = ref<boolean>(false)

  // toolbar
  // 新增内容输入框绑定
  const inputAddContent = ref<string>('')
  // 新增描述输入框绑定
  const inputAddDescription = ref<string>('')
  // 是否展开新增待办的描述组件
  const addSpread = ref<boolean>(false)
  // 新增loading
  const addLoading = ref<boolean>(false)
  // 排序条件
  const orderBy = ref<OrderBy>('create-desc')
  // 过滤条件
  const filterBy = ref<FilterBy>('all')

  // list
  // 待办列表
  const todos = ref<Todo[]>([])
  // 待办列表加载中loading
  const todosLoading = ref(false)

  // pagination
  // 当前页码
  const currentPage = ref<number>(1)
  // 每个页面的条目数量
  const pageSize = ref<number>(20)
  // 接口返回的总代条目数量
  const total = ref<number>(1)

  /**
   * 添加
   * @returns
   */
  function handleAddTodo() {
    if (inputAddContent.value === '' || addLoading.value === true) return
    const param = {
      uid: userStore.mySelf.id,
      content: inputAddContent.value,
      description: inputAddDescription.value,
    }
    addLoading.value = true
    addTodo(param)
      .then(() => {
        inputAddContent.value = ''
        inputAddDescription.value = ''
        addSpread.value = false
        currentPage.value = 1
        fetchTodos()
      })
      .catch((err) => {
        error(err)
      })
      .finally(() => {
        addLoading.value = false
      })
  }

  /**
   * 变更排序条件并刷新列表
   * @param {OrderBy} newOrder 排序条件
   */
  function changeOrder(newOrder: OrderBy) {
    orderBy.value = newOrder
    fetchTodos()
  }

  /**
   * 变更过滤条件并刷新列表
   * @param {FilterBy} newFilter 过滤条件
   */
  function changeFilter(newFilter: FilterBy) {
    filterBy.value = newFilter
    fetchTodos()
  }

  /**
   * 获取待办列表数据
   * @returns {Promise}
   */
  function fetchTodos() {
    todosLoading.value = true
    const params = {
      params: {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        orderBy: orderBy.value,
        filterBy: filterBy.value,
      },
    }
    return get('/todo', params)
      .then((res) => {
        const { code, message, data } = Object(res)
        const { list, total: reqTotal } = Object(data)
        total.value = reqTotal
        if (code === 0) {
          todos.value = formatTodos(list)
        } else {
          error('获取待办接口错误:', message)
          return Promise.reject(message)
        }
      })
      .catch((err) => {
        error('fetchTodosError', err)
      })
      .finally(() => {
        todosLoading.value = false
      })
  }

  /**
   * 编辑待办数据
   * @param {number} id 待办ID
   * @param {string} content 内容
   * @param {string} description 描述
   * @returns {Promise}
   */
  function editTodo(id: number, content: string, description: string): Promise<void> {
    const todo = todos.value.find((item) => item.id === id)
    if (todo?.editSaveLoading) return Promise.resolve()
    if (todo) {
      const { done } = todo
      const params: ReqTodo = { id, content, description, done: Number(done) }

      todo.editSaveLoading = true
      return updateTodo(params)
        .then(() => {
          fetchTodos()
        })
        .finally(() => {
          todo.editSaveLoading = false
        })
    }
    return Promise.reject(Error('ID错误'))
  }

  /**
   * 删除
   * @param {number} id 待办ID
   * @returns {Promise}
   */
  function deleteTodo(id: number) {
    const { id: uid } = userStore.mySelf
    if (id === 0 || deleteLoading.value === true) return
    const item = todos.value.find((elem) => elem.id === id)
    if (!item || item.uid !== uid) return

    deleteLoading.value = true
    return del(`/todo/${id}`)
      .then((res) => {
        const { code, message } = Object(res)
        if (code !== 0) {
          error('删除待办接口错误:', message)
        } else {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          fetchTodos()
        }
      })
      .catch((err) => {
        error('网络错误:', err)
      })
      .finally(() => {
        deleteLoading.value = false
      })
  }

  /**
   * 切换待办的完成与否状态
   * @param {number} id 待办ID
   * @returns {Promise}
   */
  function toggleTodoDone(id: number) {
    const todo = todos.value.find((item) => item.id === id)
    if (todo?.doneLoading) return
    if (todo) {
      todo.doneLoading = true
      const p = revertTodo(todo)
      const params = { ...p } as ReqTodo
      params.done = !todo.done ? 1 : 0
      return updateTodo(params)
        .then(() => {
          fetchTodos()
        })
        .finally(() => {
          todo.doneLoading = false
        })
    }
  }

  /**
   * 切换指定条目的描述展开状态
   * @param {number} id 待办ID
   */
  function toggleSpread(id: number) {
    const todo = todos.value.find((item) => item.id === id)
    if (todo) {
      todo.spread = !todo.spread
    }
  }

  /**
   * 切换指定待办的编辑状态
   * @param {number} id 待办ID
   * @param {boolean} newStatus 新的状态值
   */
  function toggleEditing(id: number, newStatus: boolean) {
    resetEditing(todos.value)
    const todo = todos.value.find((item) => item.id === id)
    if (todo) {
      todo.editing = newStatus
      // 编辑后描述为空时收起
      // if (!todo.description) todo.spread = false
    }
  }

  /**
   * 分页切换处理方法与刷新待办列表
   * @param {number} current 当前页码
   */
  function handleCurrentPageChange(current: number) {
    currentPage.value = current
    fetchTodos()
  }

  return {
    inputAddContent,
    inputAddDescription,
    addSpread,
    addLoading,
    orderBy,
    filterBy,
    todos,
    todosLoading,
    currentPage,
    total,
    pageSize,
    deleteLoading,
    handleAddTodo,
    changeOrder,
    changeFilter,
    fetchTodos,
    editTodo,
    toggleTodoDone,
    toggleSpread,
    toggleEditing,
    handleCurrentPageChange,
    deleteTodo,
  }
})
