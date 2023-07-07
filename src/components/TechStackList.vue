<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTechStackStore } from '@/stores/tech-stack'

const store = useTechStackStore()
const { currentList } = storeToRefs(store)
</script>

<template>
    <div id="tech-stack-wrap">
      <el-table :data="currentList">
        <el-table-column prop="name" label="技术名称" />
        <el-table-column prop="link" label="官方链接" />
      </el-table>
    </div>
</template>

<style>

</style>
