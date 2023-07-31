import { ref } from 'vue'
import { defineStore } from 'pinia'
import { get } from '@/logics/request'
import { error } from '@/utils/logger'

export const useCauserieStore = defineStore('causerie', () => {
  const causeries = ref<Causerie[]>([])
  const causeriesLoading = ref<boolean>(false)

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

  return { causeries, fetchCauseries }
})
