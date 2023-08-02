<script setup lang="ts">
import MaskLayer from '../MaskLayer.vue'
import { useCauserieStore } from '../../stores/causerie'
import { toRefs } from 'vue'

const causerieStore = useCauserieStore()
const { createLayerShow, createContent, isEdit } = toRefs(causerieStore)
const { createCauserie, editCauserie } = causerieStore

function handleCancel() {
  createLayerShow.value = false
  if (isEdit) {
    isEdit.value = false
    createContent.value = ''
  }
}
</script>

<template>
  <MaskLayer @cancel="handleCancel" v-if="createLayerShow">
    <div class="flex flex-col w-[50rem] bg-main-background-color" @click.stop>
      <el-input type="textarea" placeholder="分享此刻的灵感" v-model="createContent" />
      <el-button class="-mt-[1px]" @click="editCauserie" v-if="isEdit">保存</el-button>
      <el-button class="-mt-[1px]" @click="createCauserie" v-else>创建</el-button>
    </div>
  </MaskLayer>
</template>
