import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '../router/index'

export const useHeaderStore = defineStore('header', () => {
  const currentMenu = ref<string>('home')
  /**
   * 切换菜单
   *
   * @param {string} routeName 路由名称
   */
  function changeMenu(routeName: string): void {
    currentMenu.value = routeName
    router.push({
      name: routeName,
    })
  }

  return { currentMenu, changeMenu }
})
