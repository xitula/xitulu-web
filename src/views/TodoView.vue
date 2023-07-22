<script setup lang="ts">
import { error } from '../utils/logger'
import { ref, onMounted, toRefs } from 'vue'
import { useTodoStore } from '../stores/todo'

const todoStore = useTodoStore()
const { todos, todosLoading, currentPage, pageSize, total } = toRefs(todoStore)
const {
  toggleTodoDone,
  toggleSpread,
  toggleEditing,
  editTodo,
  handleCurrentPageChange,
  handlePagePrevClick,
  handlePageNextClick,
} = todoStore
const inputContant = ref<string>('')
const inputDescription = ref<string>('')

onMounted(async () => {
  try {
    await todoStore.fetchTodos()
  } catch (err) {
    error('todoStoreError', err)
  }
})

function handleEditStart(id: number) {
  const todo = todos.value.find((item) => item.id === id)
  const { contant, description } = todo
  inputContant.value = contant
  inputDescription.value = description
  toggleEditing(id, true)
}

function handleEditSave(id: number) {
  editTodo(id, inputContant.value, inputDescription.value).then(() => {
    toggleEditing(id, false)
  })
}
</script>

<template>
  <div id="todo-wrap" class="flex">
    <div id="toolbar">toolbar</div>
    <div id="list" class="flex" v-loading="todosLoading">
      <div class="flex item" v-for="item in todos" :key="item.id">
        <div class="flex todo-main-box">
          <div class="flex btn" @click="toggleTodoDone(item.id)">
            <el-icon v-if="item.done && !item.doneLoading">
              <Check />
            </el-icon>
            <el-icon v-if="item.doneLoading">
              <Loading />
            </el-icon>
          </div>
          <div class="flex contant-box">
            <div
              v-if="!item.editing"
              class="contant"
              :class="{ decoration: item.done }"
              :alt="item.contant"
            >
              {{ item.contant }}
            </div>
            <el-input v-else class="contant" placeholder="事项内容" v-model="inputContant" />
          </div>
          <div class="flex btns">
            <div class="spread" :hidden="!item.description">
              <div class="flex btn" v-if="!item.spread">
                <el-icon @click="toggleSpread(item.id)">
                  <ArrowDown />
                </el-icon>
              </div>
              <div class="flex btn" v-else>
                <el-icon @click="toggleSpread(item.id)">
                  <ArrowUp />
                </el-icon>
              </div>
            </div>
            <div class="flex btn">
              <el-icon v-if="item.editSaveLoading">
                <Loading />
              </el-icon>
              <el-icon v-else-if="!item.editing" @click="handleEditStart(item.id)">
                <EditPen />
              </el-icon>
              <el-icon v-else @click="handleEditSave(item.id)">
                <Check />
              </el-icon>
            </div>
          </div>
          <!-- <div class="create-date" hidden :alt="item.createDate">{{ item.createDate }}</div> -->
        </div>
        <div v-if="item.spread" class="flex description-box">
          <div v-if="!item.editing" class="flex description">{{ item.description }}</div>
          <el-input v-else type="textarea" v-model="inputDescription" placeholder="事项描述" />
        </div>
      </div>
    </div>
    <div id="pagination" class="flex">
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        :page-size="pageSize"
        layout="prev, pager, next"
        @current-change="handleCurrentPageChange"
        @prev-click="handlePagePrevClick"
        @next-click="handlePageNextClick"
      />
    </div>
  </div>
</template>

<style scoped>
/* [hidden] {
  display: none;
} */

#todo-wrap {
  height: 100%;
  flex-direction: column;
}

#toolbar {
  width: 100%;
  height: 3rem;
  border-bottom: 1px solid var(--main-color);
}

#list {
  flex-grow: 1;
  width: 100%;
  height: 10rem;
  padding: 0.3rem var(--main-padding);
  flex-direction: column;
  justify-content: flex-start;
  overflow: auto;
  font-size: 2rem;
  color: var(--main-color);
}

.item {
  flex-shrink: 0;
  width: 100%;
  min-height: 3rem;
  flex-direction: column;
  align-items: normal;
}

.todo-main-box {
  min-width: 0;
}

.contant-box {
  flex-grow: 1;
  padding: 0 1rem;
  min-width: 0;
}

.contant {
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: default;
}

.decoration {
  text-decoration: line-through;
}

.btns {
  display: flex;
}

.btn {
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--main-color);
  border-radius: 5px;
  cursor: pointer;
}

.btns > .btn {
  margin-left: 1rem;
}

.description-box {
  border: 1px solid var(--main-color);
  border-top: none;
  padding: 0.5rem;
  padding-top: 0;
  flex-direction: column;
}

.description {
  width: 100%;
  justify-content: flex-start;
}

#pagination {
  width: 100%;
  height: 3rem;
  border-top: 1px solid var(--main-color);
}
</style>