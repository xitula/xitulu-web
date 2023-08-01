<script setup lang="ts">
import { error } from '../utils/logger'
import { ref, onMounted, toRefs } from 'vue'
import { useTodoStore } from '../stores/todo'
import Pagination from '../components/Todo/PaginationComp.vue'
import Toolbar from '../components/Todo/ToolbarComp.vue'

const todoStore = useTodoStore()
const { todos, todosLoading } = toRefs(todoStore)
const { toggleTodoDone, toggleSpread, toggleEditing, editTodo } = todoStore
const inputContent = ref<string>('')
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
  const { content, description } = todo
  inputContent.value = content
  inputDescription.value = description
  toggleEditing(id, true)
}

function handleEditSave(id: number) {
  const todo = todos.value.find((item) => item.id === id)
  if (todo.content !== inputContent.value || todo.description !== inputDescription.value) {
    editTodo(id, inputContent.value, inputDescription.value).then(() => {
      toggleEditing(id, false)
    })
  } else {
    toggleEditing(id, false)
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center h-full">
    <Toolbar />
    <!-- 列表 -->
    <div
      class="flex flex-col justify-start items-center grow w-full px-[1rem] overflow-scroll text-[2rem] text-[--main-color]"
      v-loading="todosLoading"
    >
      <!-- 条目 -->
      <div
        class="flex flex-col justify-center shrink-0 w-full min-h-[3rem]"
        v-for="item in todos"
        :key="item.id"
      >
        <div class="flex justify-center items-center min-w-0">
          <!-- 完成状态 -->
          <div
            class="flex justify-center items-center shrink-0 btn"
            @click="toggleTodoDone(item.id)"
          >
            <el-icon v-if="item.done && !item.doneLoading">
              <Check />
            </el-icon>
            <el-icon v-if="item.doneLoading">
              <Loading />
            </el-icon>
          </div>
          <!-- 内容 -->
          <div
            class="flex justify-center items-center grow px-4 overflow-hidden whitespace-nowrap text-ellipsis cursor-default"
          >
            <div
              v-if="!item.editing"
              class="content"
              :class="{ 'line-through': item.done }"
              :alt="item.content"
            >
              {{ item.content }}
            </div>
            <el-input v-else class="content" placeholder="事项内容" v-model="inputContent" />
          </div>
          <!-- 按钮容器 -->
          <div class="flex">
            <!-- 展开按钮 -->
            <div
              class="flex justify-center items-center mr-4"
              v-if="item.description || item.editing"
            >
              <div class="flex justify-center items-center shrink-0 btn" v-if="!item.spread">
                <el-icon @click="toggleSpread(item.id)">
                  <ArrowDown />
                </el-icon>
              </div>
              <div class="flex justify-center items-center shrink-0 btn" v-else>
                <el-icon @click="toggleSpread(item.id)">
                  <ArrowUp />
                </el-icon>
              </div>
            </div>
            <!-- 编辑按钮 -->
            <div class="flex justify-center items-center shrink-0 btn">
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
        <!-- 描述 -->
        <div
          v-if="item.spread"
          class="flex flex-col justify-center items-center mt-[-1px] p-2 border border-[--main-color] border-t-0"
        >
          <div v-if="!item.editing" class="flex justify-start items-center w-full">
            {{ item.description }}
          </div>
          <el-input v-else type="textarea" v-model="inputDescription" placeholder="事项描述" />
        </div>
      </div>
    </div>
    <Pagination />
  </div>
</template>

<style scoped>
/* [hidden] {
  display: none;
} */
@tailwind components;

@layer components {
  .content {
    @apply grow
      overflow-hidden
      whitespace-nowrap
      text-ellipsis
      cursor-default;
  }
  .btn {
    @apply w-8
      h-8
      border
      border-[--main-color]
      rounded-lg
      cursor-pointer;
  }
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  @apply text-[2rem];
}
</style>
