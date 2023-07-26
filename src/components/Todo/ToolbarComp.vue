<script setup lang="ts">
import { toRefs } from 'vue'
import { useTodoStore } from '../../stores/todo'

const todoStore = useTodoStore()

const { inputAddContent, inputAddDescription, addSpread, addLoading, orderBy, filterBy } =
  toRefs(todoStore)
const { handleAddTodo, changeOrder, changeFilter } = todoStore

function toggleSpread() {
  addSpread.value = !addSpread.value
}
</script>

<template>
  <div id="toolbar" class="flex">
    <div class="flex" id="input-wrap">
      <el-input id="content" size="small" v-model="inputAddContent" />
      <div class="flex btn" v-if="addSpread">
        <el-icon @click="toggleSpread()">
          <ArrowUp />
        </el-icon>
      </div>
      <div class="flex btn" v-else>
        <el-icon @click="toggleSpread()">
          <ArrowDown />
        </el-icon>
      </div>
      <div class="flex btn" @click="handleAddTodo" v-if="!addLoading">新增</div>
      <div class="flex btn" @click="handleAddTodo" v-else>
        <el-icon>
          <Loading />
        </el-icon>
      </div>
      <div id="description" v-if="addSpread">
        <el-input v-model="inputAddDescription" type="textarea" />
      </div>
    </div>
    <div id="right-btns">
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
  </div>
</template>

<style scoped>
#toolbar {
  justify-content: space-between;
  padding-right: 1rem;
}

#input-wrap {
  position: relative;
  justify-content: flex-start;
  flex-grow: 1;
  padding-left: 0.1rem;
  padding-right: 3rem;
}

#content {
  height: 2.8rem;
}

#description {
  position: absolute;
  top: 3rem;
  width: 100%;
  background-color: var(--main-background-color);
  z-index: 1;
}

.btn {
  flex-grow: 1;
  flex-direction: row;
  margin-left: 1rem;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.4rem;
  border: 1px solid var(--main-color);
  border-radius: 5px;
  color: var(--main-color);
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  font-size: 1.4rem;
}

.active {
  color: var(--main-color-light);
}
</style>
