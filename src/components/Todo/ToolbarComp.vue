<script setup lang="ts">
import { toRefs } from 'vue'
import { useTodoStore } from '../../stores/todo'

const todoStore = useTodoStore()
const { orderBy } = toRefs(todoStore)
const { changeOrder } = todoStore

function handleCommand(order) {
  changeOrder(order)
}
</script>

<template>
  <div id="toolbar" class="flex">
    <el-dropdown placement="bottom-end" trigger="click" @command="handleCommand">
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
  </div>
</template>

<style scoped>
#toolbar {
  justify-content: flex-end;
  padding-right: 1rem;
}

.btn {
  height: 2rem;
  padding: 0 0.2rem;
  border: 1px solid var(--main-color);
  border-radius: 5px;
  color: var(--main-color);
  cursor: pointer;
}

.btns > .btn {
  margin-left: 1rem;
}

.active {
  color: var(--main-color-light);
}
</style>
