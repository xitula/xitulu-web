import { ref } from 'vue'
import { defineStore } from 'pinia'
import { del, get, post, put } from '@/logics/request'
import { error } from '@/utils/logger'
import { useUserStore } from './user'
import { ElMessage } from 'element-plus'

export const useCauserieStore = defineStore('causerie', () => {
  // 是否展示新增或编辑弹层
  const createLayerShow = ref<boolean>(false)
  // 输入的创建内容
  const createContent = ref<string>('')
  // 新增中loading
  const createLoading = ref<boolean>(false)
  // 随感列表
  const causeries = ref<Causerie[]>([])
  // 随感加载中loading
  const causeriesLoading = ref<boolean>(false)
  // 新增弹层是否为编辑模式
  const isEdit = ref<boolean>(false)
  // 变集中的随感ID
  const editId = ref<number>(0)
  // 删除中loading
  const deleteLoading = ref<boolean>(false)

  const userStore = useUserStore()
  const { mySelf } = userStore

  /**
   * 设置编辑弹层编辑中的随感数据
   * @param {Causerie} item 随感数据
   */
  function setEdit(item: Causerie) {
    editId.value = item.id
    createContent.value = item.content
    createLayerShow.value = true
    isEdit.value = true
  }

  /**
   * 创建随感
   * @returns {*}
   */
  function createCauserie() {
    const { id } = mySelf
    // 防止重复请求且需要登录
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
          error('创建随感接口错误:', message)
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

  /**
   * 编辑随感
   * @returns {*}
   */
  function editCauserie() {
    const { id: uid } = mySelf
    // 防止重复提交
    if (uid === 0 || createLoading.value === true) return
    const item = causeries.value.find((elem) => elem.id === editId.value)
    // 只允许操作本人数据
    if (!item || item.uid !== uid) return

    const params = {
      id: item.id,
      content: createContent.value,
    }

    createLoading.value = true
    return put('/causeries', params)
      .then((res) => {
        const { code, message } = Object(res)
        if (code !== 0) {
          error('更新随感接口错误:', message)
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

  /**
   * 获取随感列表
   * @returns {*}
   */
  function fetchCauseries() {
    causeriesLoading.value = true
    return get('/causeries')
      .then((res) => {
        const { code, message, data } = Object(res)
        if (code !== 0) {
          error('获取随感接口错误:', message)
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

  /**
   * 删除随感
   * @param {number} id 随感ID
   * @returns {*}
   */
  function deleteCauserie(id: number) {
    const { id: uid } = mySelf
    // 防止重复提交
    if (id === 0 || deleteLoading.value === true) return
    const item = causeries.value.find((elem) => elem.id === id)
    // 只允许操作本人数据
    if (!item || item.uid !== uid) return

    deleteLoading.value = true
    return del(`/causeries/${id}`)
      .then((res) => {
        const { code, message } = Object(res)
        if (code !== 0) {
          error('删除随感接口错误:', message)
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
