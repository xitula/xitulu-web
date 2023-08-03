import { ref } from 'vue'
import { defineStore } from 'pinia'
import { error } from '../utils/logger'

// 基础技术栈数据
const baseTechStackList = new Map([
  // 前端相关
  ['vite', { name: 'Vite', link: 'https://vitejs.dev/' }],
  ['vue', { name: 'Vue', link: 'https://vuejs.org/' }],
  ['vueRouter', { name: 'VueRouter', link: 'https://router.vuejs.org/' }],
  ['pinia', { name: 'Pinia', link: 'https://pinia.vuejs.org/' }],
  ['elementPlus', { name: 'ElementPlus', link: 'https://element-plus.org/' }],
  ['eslint', { name: 'Eslint', link: 'https://eslint.org/' }],

  // 后端相关
  ['air', { name: 'Air', link: 'https://github.com/cosmtrek/air/' }], // golang 热更新 via Aklman&F西F西
  ['gorm', { name: 'Eslint', link: 'https://gorm.io/' }], // golang orm via F西F西
])

// 各个view使用的技术栈配置
const techStackListConfig = new Map([['home', ['vite', 'vue', 'eslint']]])

/**
 * 获取当前展示view使用到的技术栈
 * @param currentView 当前展示的view
 * @returns 当前view使用的技术栈
 */
function fetchCurrent(currentView: string): TechStack[] {
  const currentConfig = techStackListConfig.get(currentView)
  const list: TechStack[] = []

  if (currentConfig) {
    currentConfig.forEach((elem) => {
      const curr = baseTechStackList.get(elem)
      if (curr) list.push(curr)
    })

    return list
  }

  return []
}

/**
 * 配置使用技术栈store
 */
export const useTechStackStore = defineStore('techStack', () => {
  // 当前view技术栈列表
  const currentList = ref<TechStack[]>([])

  // 技术栈列表显示状态
  const techStackListShow = ref(false)

  /**
   * 设置当前技术栈
   * @param viewName 当前view name
   */
  function setTechStack(viewName: string): void {
    const list = fetchCurrent(viewName)
    if (list) {
      currentList.value = list
    } else {
      error('设置当前技术栈失败', viewName)
    }
  }

  return { currentList, setTechStack, techStackListShow }
})
