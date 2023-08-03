import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { get, post, put, del } from '../logics/request'
import { error } from '../utils/logger'
import { useUserStore } from './user'

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

function revertTodo(todo: Todo): object {
  const { id, content, description, done: numDone } = todo
  const done = Number(numDone)
  return { id, content, description, done }
}

function resetEditing(todos: Todo[]) {
  todos.forEach((item) => {
    item.editing = false
  })
}

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

export const useTodoStore = defineStore('todo', () => {
  const userStore = useUserStore()
  const deleteLoading = ref<boolean>(false)
  // toolbar
  const inputAddContent = ref<string>('') // 新增内容输入框绑定
  const inputAddDescription = ref<string>('') // 新增描述输入框绑定
  const addSpread = ref<boolean>(false)
  const addLoading = ref<boolean>(false) // 新增loading
  const orderBy = ref<string>('create-desc') // create-desc | update-desc
  const filterBy = ref<string>('all') // all | tobe | done

  // list
  const todos = ref<Todo[]>([])
  const todosLoading = ref(false)

  // pagination
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(20)
  const total = ref<number>(1)

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

  function changeOrder(newOrder: string) {
    orderBy.value = newOrder
    fetchTodos()
  }

  function changeFilter(newFilter: string) {
    filterBy.value = newFilter
    fetchTodos()
  }

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

  function toggleTodoDone(id: number) {
    const todo = todos.value.find((item) => item.id === id)
    if (todo?.doneLoading) return
    if (todo) {
      todo.doneLoading = true
      const p = revertTodo(todo)
      const params = { ...p } as ReqTodo
      params.done = !todo.done ? 1 : 0
      updateTodo(params)
        .then(() => {
          fetchTodos()
        })
        .finally(() => {
          todo.doneLoading = false
        })
    }
  }

  function toggleSpread(id: number) {
    const todo = todos.value.find((item) => item.id === id)
    if (todo) {
      todo.spread = !todo.spread
    }
  }

  function toggleEditing(id: number, newStatus: boolean) {
    resetEditing(todos.value)
    const todo = todos.value.find((item) => item.id === id)
    if (todo) {
      todo.editing = newStatus
      // 编辑后描述为空时收起
      if (!todo.description) todo.spread = false
    }
  }

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
