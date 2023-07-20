<script setup lang="ts">
import { error } from '../utils/logger';
import { onMounted, toRefs } from 'vue'
import { useTodoStore } from '../stores/todo'

const todoStore = useTodoStore()
const { todos, todosLoading, toggleSpread } = toRefs(todoStore)

onMounted(async () => {
  try {
    await todoStore.fetchTodos()
  } catch (err) {
    error('todoStoreError', err)
  }
})

function handleDoneChange(id) {
  todoStore.toggleTodoDone(id)
}

function handleBtnEdit(id) {
  console.log('🚀[id]', id)
}

</script>

<template>
  <div id="list" class="flex" v-loading="todosLoading">
    <div class="flex item" v-for="item in todos" :key="item.id">
      <div class="flex contant-box">
        <div class="flex btn" @click="handleDoneChange(item.id)">
          <el-icon v-if="item.done">
            <Check />
          </el-icon>
        </div>
        <div class="contant" :class="{ decoration: item.done }" :alt="item.contant">{{ item.contant }}</div>
        <div class="flex btns">
          <div class="spread" :hidden="!item.description">
          <div class="flex btn" v-if="!item.spread">
            <el-icon @click="toggleSpread(item.id)">
              <Plus />
            </el-icon>
          </div>
          <div class="flex btn" v-else>
            <el-icon @click="toggleSpread(item.id)">
              <Minus />
            </el-icon>
          </div>
          </div>
          <div class="flex btn">
            <el-icon @click="handleBtnEdit(item.id)">
              <EditPen />
            </el-icon>
          </div>
        </div>
        <div class="create-date" hidden :alt="item.description">{{ item.createDate }}</div>
      </div>
      <div v-if="item.spread" class="flex description">{{ item.description }}</div>
    </div>
  </div>
</template>

<style scoped>
#list {
  flex-grow: 1;
  width: 100%;
  padding: .3rem var(--main-padding);
  flex-direction: column;
  font-size: 2rem;
  color: var(--color-main-contant);
}

.item {
  width: 100%;
  min-height: 3rem;
  flex-direction: column;
  align-items: normal;
}

.contant-box {
  flex-grow: 1;
}

.contant {
  flex-grow: 1;
  margin-left: 1rem;
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
  border: 1px solid var(--color-main-contant);
  border-radius: 5px;
  cursor: pointer;
}

.btns>.btn {
  margin-left: 1rem;
}

.description {
  border: 1px solid var(--color-main-contant);
  border-top: none;
  padding: .5rem;
  padding-top: 0;
  justify-content: flex-start;
}
</style>
