/**
 * footer store 文件
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFooterStore = defineStore('footer', () => {
  const hints = ref<string[]>([])

  /**
   * 配置命令提示
   *
   * @param {string[]} list 输入的命令列表
   */
  function setHints(list: string[]): void {
    hints.value = list
  }

  return { hints, setHints }
})
