<script setup lang="ts">
import { ref, watch } from 'vue'
import CommandLineSimulator from '../../logics/CommandLineSimulator'
import CommandLineHint from './CommandLineHint.vue'
import { useFooterStore } from '../../stores/footer'

const footerStore = useFooterStore()
const cls = new CommandLineSimulator()
const command = ref<string>('')

watch(command, (newCmd) => {
  // TODO 增加debounce
  cls.matchCommand(newCmd)
})

/**
 * 提交命令执行
 */
function changeHandler(cmd: string): void {
  const { code } = cls.execCommand(cmd)
  if (code === 0) command.value = ''
}

/**
 * 失去焦点时清空命令提示
 */
function blurHandler(): void {
  footerStore.setHints([])
}
</script>

<template>
  <div class="relative flex flex-col w-full">
    <CommandLineHint />
    <el-input v-model="command" @change="changeHandler" @blur="blurHandler" />
  </div>
</template>
