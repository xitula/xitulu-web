import { ref } from 'vue'
import { defineStore } from 'pinia'
import { get, post, put } from '../logics/request'
import { error } from '../utils/logger'

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
  const { id, contant, description, done: numDone } = todo
  const done = Number(numDone)
  return { id, contant, description, done }
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
        error('updateTodoError:', message)
        return Promise.reject(Error(message))
      }
    })
    .catch((err) => {
      error('updateTodoError', err)
    })
}

export const useTodoStore = defineStore('todo', () => {
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
      contant: inputAddContent.value,
      description: inputAddDescription.value,
    }
    addLoading.value = true
    addTodo(param)
      .then(() => {
        inputAddContent.value = ''
        inputAddDescription.value = ''
        addSpread.value = false
        fetchTodos()
        currentPage.value = 1
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
          error('fetchTodosError:', message)
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

  function editTodo(id: number, contant: string, description: string): Promise<void> {
    const todo = todos.value.find((item) => item.id === id)
    if (todo?.editSaveLoading) return Promise.resolve()
    if (todo) {
      const { done } = todo
      const params: ReqTodo = { id, contant, description, done: Number(done) }

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
    handleAddTodo,
    changeOrder,
    changeFilter,
    fetchTodos,
    editTodo,
    toggleTodoDone,
    toggleSpread,
    toggleEditing,
    handleCurrentPageChange,
  }
})
