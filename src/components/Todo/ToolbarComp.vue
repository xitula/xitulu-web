<script setup lang="ts">
import { toRefs } from 'vue'
import { useTodoStore } from '../../stores/todo'
import { useUserStore } from '../../stores/user'

const todoStore = useTodoStore()
const userStore = useUserStore()

const { inputAddContent, inputAddDescription, addSpread, addLoading, orderBy, filterBy } =
  toRefs(todoStore)
const { handleAddTodo, changeOrder, changeFilter } = todoStore

function toggleSpread() {
  addSpread.value = !addSpread.value
}

function handleAddClick() {
  const {
    mySelf: { id },
  } = userStore
  if (id === 0) {
    userStore.loginHint = '需要登录之后才能添加待办事项'
    userStore.showLogin = true
  } else {
    handleAddTodo()
  }
}
</script>

<template>
  <div
    class="flex grow-0 shrink-0 justify-between items-center w-full p-[.2rem] pr-4 border-b border-main-color"
  >
    <div class="relative flex justify-start items-center grow">
      <!-- 内容输入框 -->
      <el-input class="h-[2.8rem] text-[1.2rem]" v-model="inputAddContent" />
      <!-- 展开按钮 -->
      <div class="btn btn-no-px" v-if="addSpread">
        <el-icon @click="toggleSpread()">
          <ArrowUp />
        </el-icon>
      </div>
      <div class="btn btn-no-px" v-else>
        <el-icon @click="toggleSpread()">
          <ArrowDown />
        </el-icon>
      </div>
      <!-- 新增按钮 -->
      <div class="btn" @click="handleAddClick" v-if="!addLoading">新增</div>
      <div class="btn" @click="handleAddTodo" v-else>
        <el-icon>
          <Loading />
        </el-icon>
      </div>
      <!-- 描述输入框 -->
      <div class="absolute top-[3.3rem] w-full bg-main-background-color z-10" v-if="addSpread">
        <el-input v-model="inputAddDescription" type="textarea" />
      </div>
    </div>
    <div id="right-btns">
      <!-- 排序下拉菜单 -->
      <el-dropdown placement="bottom-end" trigger="click" @command="changeOrder">
        <div class="btn">排序</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="create-desc">
              <template #default>
                <span :class="{ active: orderBy === 'create-desc' }"> 创建时间倒序 </span>
              </template>
            </el-dropdown-item>
            <el-dropdown-item command="update-desc">
              <template #default>
                <span :class="{ active: orderBy === 'update-desc' }"> 最后更新倒序 </span>
              </template>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 过滤下拉菜单 -->
      <el-dropdown placement="bottom-end" trigger="click" @command="changeFilter">
        <div class="btn">过滤</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="all">
              <template #default>
                <span :class="{ active: filterBy === 'all' }"> 全部 </span>
              </template>
            </el-dropdown-item>
            <el-dropdown-item command="tobe">
              <template #default>
                <span :class="{ active: filterBy === 'tobe' }"> 未完成 </span>
              </template>
            </el-dropdown-item>
            <el-dropdown-item command="done">
              <template #default>
                <span :class="{ active: filterBy === 'done' }"> 已完成 </span>
              </template>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
@tailwind components;

@layer components {
  .btn {
    @apply flex 
    justify-center 
    items-center 
    cursor-pointer 
    overflow-hidden 
    ml-4 
    min-w-[2rem] 
    h-8 
    px-[.4rem]
    border 
    border-main-color 
    rounded-md
    text-[1.4rem]
    text-main-color
    whitespace-nowrap;
  }
  .btn-no-px {
    @apply px-0;
  }
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  @apply text-[1.6rem];
}

.active {
  @apply text-main-color-light;
}
</style>
