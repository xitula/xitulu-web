import { ref } from 'vue'
import { defineStore } from 'pinia'
import { get, put } from '../logics/request'
import { error } from '../utils/logger'

function formatTodos(todo: Todo[]): Todo[] {
  return todo.map((item) => {
    const { done, ...others } = Object(item)
    return { done: Boolean(done), doneLoading: false, spread: false, ...others }
  })
}

function revertTodo(todo: Todo): object {
  const { id, contant, description, done: numDone } = todo
  const done = Number(numDone)
  return { id, contant, description, done }
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const todosLoading = ref(false)

  function fetchTodos() {
    todosLoading.value = true
    return get('/todo')
      .then((res) => {
        const { code, message, data } = Object(res)
        if (code === 0) {
          todos.value = formatTodos(data)
          todosLoading.value = false
        } else {
          error('fetchTodosError:', message)
          todosLoading.value = false
          return Promise.reject(Error('fetchTodos接口错误'))
        }
      })
      .catch((err) => {
        todosLoading.value = false
        error('fetchTodosError', err)
      })
  }

  function toggleTodoDone(id: number) {
    const todo = todos.value.find(item => item.id === id)
    if (todo) {
      todo.done = !todo.done
      const params = revertTodo(todo)
      return put(`/todo`, params)
        .then((res) => {
          const { code, message } = Object(res)
          if (code === 0) {
            fetchTodos()
            return 0
          } else {
            error('updateTodoError:', message)
            return Promise.reject(Error('toggleTodoDone接口错误'))
          }
        })
        .catch((err) => {
          error('updateTodoError', err)
        })
    }
  }

  function toggleSpread(id: number) {
    const todo = todos.value.find(item => item.id === id)
    if (todo) {
      todo.spread = !todo.spread
    }
  }

  return { todos, todosLoading, fetchTodos, toggleTodoDone, toggleSpread }
})
