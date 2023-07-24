<script setup lang="ts">
import { toRefs } from 'vue'
import { useTodoStore } from '../../stores/todo'

const todoStore = useTodoStore()
const { orderBy, filterBy } = toRefs(todoStore)
const { changeOrder, changeFilter } = todoStore
</script>

<template>
  <div id="toolbar" class="flex">
    <!-- 排序 -->
    <el-dropdown placement="bottom-end" trigger="click" @command="changeOrder">
      <div class="flex btn">排序</div>
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
    <!-- 过滤 -->
    <el-dropdown placement="bottom-end" trigger="click" @command="changeFilter">
      <div class="flex btn">过滤</div>
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
</template>

<style scoped>
#toolbar {
  justify-content: flex-end;
  padding-right: 1rem;
}

.btn {
  margin-left: 1rem;
  height: 2rem;
  padding: 0 0.2rem;
  border: 1px solid var(--main-color);
  border-radius: 5px;
  color: var(--main-color);
  cursor: pointer;
}

.active {
  color: var(--main-color-light);
}
</style>
