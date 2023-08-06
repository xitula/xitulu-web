import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'
import { get, post, put } from '@/logics/request'
import { ElMessage } from 'element-plus'
import { ArticleMode } from '@/constants/article'

export const useArticleStore = defineStore('atricleStore', () => {
  const userStore = useUserStore()

  // 文章处理模式
  const mode = ref<ArticleMode>(ArticleMode.List)
  // 当前文章标题
  const title = ref<string>('')
  // 当前文章内容
  const content = ref<string>('') // TODO 编辑中缓存
  // 当前编辑中文章ID
  const currentEditId = ref<number>(0)
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
  function createArticle() {
    const params = {
      uid: userStore.mySelf.id,
      title: title.value,
      content: content.value,
    }

    saveLoading.value = true
    return post('/articles', params)
      .then((res) => {
        const { code, message, data } = Object(res)
        if (code !== 0) {
          ElMessage({
            type: 'error',
            message,
          })
        } else {
          ElMessage({
            type: 'success',
            message: '创建成功',
          })
          const { id } = Object(data)
          if (id) {
            currentEditId.value = id
            mode.value = ArticleMode.Edit
          }
        }
      })
      .finally(() => {
        saveLoading.value = false
      })
  }

  function saveAtricle() {
    const params = {
      id: currentEditId.value,
      title: title.value,
      content: content.value,
    }

    saveLoading.value = true
    return put('/articles', params)
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

  function handleDone() {
    if (mode.value === ArticleMode.Create) createArticle()
    if (mode.value === ArticleMode.Edit) saveAtricle()
  }

  /**
   * 设置模式为创建
   */
  function setCreate() {
    title.value = ''
    content.value = ''
    mode.value = ArticleMode.Create
  }

  /**
   * 设置编辑中文档的信息
   * @param {number} id
   */
  function setEdit(id: number) {
    const target = articles.value?.find((elem) => elem.id === id)
    if (target) {
      currentEditId.value = target.id
      title.value = target.title
      content.value = target.content
      mode.value = ArticleMode.Edit
    }
  }

  function setView(id: number) {
    const target = articles.value?.find((elem) => elem.id === id)
    if (target) {
      title.value = target.title
      content.value = target.content
      mode.value = ArticleMode.View
    }
  }

  /**
   * 设置模式为列表
   */
  function setBack2List() {
    mode.value = ArticleMode.List
    title.value = ''
    content.value = ''
    currentEditId.value = 0
    fetchArticles()
  }

  return {
    mode,
    title,
    content,
    saveLoading,
    articles,
    fetchArticles,
    handleDone,
    setBack2List,
    setEdit,
    setCreate,
  }
})
