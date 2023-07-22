import { ref } from 'vue'
import { defineStore } from 'pinia'
import { get, put } from '../logics/request'
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
  // list
  const todos = ref<Todo[]>([])
  const todosLoading = ref(false)

  // pagination
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(20)
  const total = ref<number>(1)

  function fetchTodos() {
    todosLoading.value = true
    const params = { params: { currentPage: currentPage.value, pageSize: pageSize.value } }
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

  function handlePagePrevClick() {
    fetchTodos()
  }

  function handlePageNextClick() {
    fetchTodos()
  }

  return {
    todos,
    todosLoading,
    currentPage,
    total,
    pageSize,
    fetchTodos,
    editTodo,
    toggleTodoDone,
    toggleSpread,
    toggleEditing,
    handleCurrentPageChange,
    handlePagePrevClick,
    handlePageNextClick,
  }
})