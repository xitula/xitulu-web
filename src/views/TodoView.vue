<script setup lang="ts">
import { error } from '../utils/logger'
import { ref, onMounted, toRefs } from 'vue'
import { useTodoStore } from '../stores/todo'
import Pagination from '../components/Todo/PaginationComp.vue'
import Toolbar from '../components/Todo/ToolbarComp.vue'
import { useUserStore } from '../stores/user'
import SquareBtn from '../components/SquareBtn.vue'
import { ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const { mySelf } = toRefs(userStore)
const todoStore = useTodoStore()
const { todos, todosLoading, deleteLoading } = toRefs(todoStore)
const { toggleTodoDone, toggleSpread, toggleEditing, editTodo, deleteTodo } = todoStore
// 输入的待办内容
const inputContent = ref<string>('')
// 输入的待办描述
const inputDescription = ref<string>('')

onMounted(async () => {
  try {
    await todoStore.fetchTodos()
  } catch (err) {
    error('todoStoreError', err)
  }
})

/**
 * 编辑开始处理方法，同步需要编辑的内容到随感弹层
 * @param {number} id 随感ID
 */
function handleEditStart(id: number) {
  const todo = todos.value.find((item) => item.id === id)
  if (todo) {
    const { content, description } = todo
    inputContent.value = content
    inputDescription.value = description
    toggleEditing(id, true)
  }
}

/**
 * 编辑保存处理方法
 * @param {number} id 随感ID
 */
function handleEditSave(id: number) {
  const todo = todos.value.find((item) => item.id === id)
  if (todo?.content !== inputContent.value || todo?.description !== inputDescription.value) {
    editTodo(id, inputContent.value, inputDescription.value).then(() => {
      toggleEditing(id, false)
    })
  } else {
    toggleEditing(id, false)
  }
}

function handleDelete(id: number) {
  ElMessageBox.confirm('是否确定删除该待办事项？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteTodo(id)
    })
    .catch()
}
</script>

<template>
  <div class="flex flex-col justify-center items-center h-full">
    <Toolbar />
    <!-- 列表 -->
    <div
      class="flex flex-col justify-start items-center grow w-full px-[1rem] overflow-scroll text-[2rem] text-main-color"
      v-loading="todosLoading"
    >
      <!-- 条目 -->
      <div
        class="flex flex-col justify-center shrink-0 w-full min-h-[3rem] hover:bg-main-background-color-deep"
        v-for="item in todos"
        :key="item.id"
      >
        <div class="flex flex-col justify-center items-center">
          <!-- 条目主体 -->
          <div class="w-full flex justify-between items-center">
            <!-- 完成状态 -->
            <div @click="toggleTodoDone(item.id)">
              <SquareBtn v-if="item.done && !item.doneLoading">
                <Check />
              </SquareBtn>
              <SquareBtn v-else-if="item.doneLoading">
                <Loading />
              </SquareBtn>
              <SquareBtn v-else />
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
            <!-- 展开按钮 -->
            <div>
              <SquareBtn v-if="!item.spread" @click="toggleSpread(item.id)">
                <ArrowDown />
              </SquareBtn>
              <SquareBtn v-else @click="toggleSpread(item.id)">
                <ArrowUp />
              </SquareBtn>
            </div>
          </div>

          <!-- 描述与操作区 -->
          <div
            v-if="item.spread"
            class="w-full flex justify-center items-start mt-[-1px] p-2 border border-main-color border-t-0"
          >
            <!-- 描述区域 -->
            <div class="flex grow justify-start">
              <div v-if="!item.editing" class="flex justify-start items-center w-full">
                {{ item.description }}
              </div>
              <el-input v-else type="textarea" v-model="inputDescription" placeholder="事项描述" />
            </div>
            <!-- 操作区域 -->
            <div class="flex flex-col grow-0 shrink-0 justify-start" v-if="item.uid === mySelf.id">
              <!-- 编辑按钮 -->
              <div>
                <SquareBtn v-if="item.editSaveLoading">
                  <Loading />
                </SquareBtn>
                <SquareBtn v-else-if="!item.editing" @click="handleEditStart(item.id)">
                  <EditPen />
                </SquareBtn>
                <SquareBtn v-else @click="handleEditSave(item.id)">
                  <Check />
                </SquareBtn>
              </div>
              <!-- 删除按钮 -->
              <div class="mt-4">
                <SquareBtn v-if="deleteLoading">
                  <Loading />
                </SquareBtn>
                <SquareBtn v-else @click="handleDelete(item.id)">
                  <Delete />
                </SquareBtn>
              </div>
            </div>
            <!-- <div class="create-date" hidden :alt="item.createDate">{{ item.createDate }}</div> -->
          </div>
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
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  @apply text-[2rem];
}
</style>
