import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'
import { get, post } from '@/logics/request'
import { ElMessage } from 'element-plus'
import { ArticleMode } from '@/constants/article'

export const useArticleStore = defineStore('atricleStore', () => {
  const userStore = useUserStore()

  // 文章处理模式
  const mode = ref<ArticleMode>(ArticleMode.List)
  // 当前文章标题
  const title = ref<string>('')
  // 当前文章内容
  const content = ref<string>('')
  // 文章保存loading
  const saveLoading = ref<boolean>(false)
  // 文章列表
  const articles = ref<Article[]>([])
  // 文章列表加载中loading
  const fetchLoading = ref<boolean>(false)

  /**
   * 获取文章列表
   */
  function fetchArticles() {
    fetchLoading.value = true
    return get('/articles')
      .then((res) => {
        const {
          code,
          message,
          data: { list },
        } = Object(res)
        if (code !== 0) {
          ElMessage({
            type: 'error',
            message,
          })
        } else {
          articles.value = list as Article[]
        }
      })
      .finally(() => {
        fetchLoading.value = false
      })
  }

  /**
   * 文章保存处理方法
   */
  function handleSave() {
    const params = {
      uid: userStore.mySelf.id,
      title: title.value,
      content: content.value,
    }

    saveLoading.value = true
    return post('/articles', params)
      .then((res) => {
        const { code, message } = Object(res)
        if (code !== 0) {
          ElMessage({
            type: 'error',
            message,
          })
        } else {
          ElMessage({
            type: 'success',
            message: '保存成功',
          })
        }
      })
      .finally(() => {
        saveLoading.value = false
      })
  }

  return { mode, title, content, saveLoading, articles, fetchArticles, handleSave }
})
