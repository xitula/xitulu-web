<script setup lang="ts">
import { ref, watch } from 'vue'
import { matchCommand, execCommand } from '../logics/command-line-simulator'

const command = ref<string>('')

watch(command, (newCmd) => {
  if (newCmd) {
    // TODO 增加debounce；增加匹配结果展示
    matchCommand(newCmd)
  }
})

/**
 * 提交命令时的处理方法
 */
function changeHandler(cmd): void {
  const { code } = execCommand(cmd)
  if (code === 0) command.value = ''
}
</script>

<template>
  <el-input v-model="command" @change="changeHandler" />
</template>
