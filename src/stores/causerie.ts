import { ref } from 'vue'
import { defineStore } from 'pinia'
import { del, get, post, put } from '@/logics/request'
import { error } from '@/utils/logger'
import { useUserStore } from './user'
import { ElMessage } from 'element-plus'

export const useCauserieStore = defineStore('causerie', () => {
  const createLayerShow = ref<boolean>(false)
  const createContent = ref<string>('')
  const createLoading = ref<boolean>(false)
  const causeries = ref<Causerie[]>([])
  const causeriesLoading = ref<boolean>(false)
  const isEdit = ref<boolean>(false)
  const editId = ref<number>(0)
  const deleteLoading = ref<boolean>(false)

  const userStore = useUserStore()
  const { mySelf } = userStore

  function setEdit(item: Causerie) {
    editId.value = item.id
    createContent.value = item.content
    createLayerShow.value = true
    isEdit.value = true
  }

  function createCauserie() {
    const { id } = mySelf
    if (id === 0 || createLoading.value === true) return

    const params = {
      uid: userStore?.mySelf?.id,
      content: createContent.value,
    }

    createLoading.value = true
    return post('/causeries', params)
      .then((res) => {
        const { code, message } = Object(res)
        if (code !== 0) {
          error('insertCauseries API error:', message)
        } else {
          createLayerShow.value = false
          createContent.value = ''
          fetchCauseries()
          ElMessage({
            type: 'success',
            message: '创建成功',
          })
        }
      })
      .catch((err) => {
        error('网络错误:', err)
      })
      .finally(() => {
        createLoading.value = false
      })
  }

  function editCauserie() {
    const { id } = mySelf
    if (id === 0 || createLoading.value === true) return

    const item = causeries.value.find((elem) => elem.id === editId.value)
    if (!item) return

    const params = {
      id: item.id,
      content: createContent.value,
    }

    createLoading.value = true
    return put('/causeries', params)
      .then((res) => {
        const { code, message } = Object(res)
        if (code !== 0) {
          error('insertCauseries API error:', message)
        } else {
          createLayerShow.value = false
          editId.value = 0
          createContent.value = ''
          isEdit.value = false
          fetchCauseries()
          ElMessage({
            type: 'success',
            message: '更新成功',
          })
        }
      })
      .catch((err) => {
        error('网络错误:', err)
      })
      .finally(() => {
        createLoading.value = false
      })
  }

  function fetchCauseries() {
    causeriesLoading.value = true
    return get('/causeries')
      .then((res) => {
        const { code, message, data } = Object(res)
        if (code !== 0) {
          error('fetchCauseries API error:', message)
        } else {
          causeries.value = data
        }
      })
      .catch((err) => {
        error('网络错误:', err)
      })
      .finally(() => {
        causeriesLoading.value = false
      })
  }

  function deleteCauserie(id: number) {
    const { id: uid } = mySelf
    if (id === 0 || deleteLoading.value === true) return
    const item = causeries.value.find((elem) => elem.id === id)
    if (!item || item.uid !== uid) return

    deleteLoading.value = true
    return del(`/causeries/${id}`)
      .then((res) => {
        const { code, message } = Object(res)
        if (code !== 0) {
          error('fetchCauseries API error:', message)
        } else {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          fetchCauseries()
        }
      })
      .catch((err) => {
        error('网络错误:', err)
      })
      .finally(() => {
        deleteLoading.value = false
      })
  }

  return {
    createLayerShow,
    createContent,
    createLoading,
    causeries,
    isEdit,
    editId,
    fetchCauseries,
    createCauserie,
    editCauserie,
    setEdit,
    deleteCauserie,
  }
})
