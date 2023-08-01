<script setup lang="ts">
defineProps<{
  item: Causerie
}>()
</script>

<template>
  <div class="wrap flex">
    <div class="flex item">
      <div class="left">
        <div class="avatar-box">
          <el-icon class="avatar"><UserFilled /></el-icon>
        </div>
      </div>
      <div class="">
        <div class="user-info">
          <div class="nickname font-bold">{{ item.uid }}</div>
        </div>
        <div class="content">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#wrap {
  padding: var(--main-padding);
}
.item {
  margin-bottom: 2rem;
  color: var(--main-color);
  align-items: flex-start;
}
.left {
  flex-shrink: 0;
}
.right {
  padding-left: 1rem;
}
.avatar-box {
  width: 5rem;
  height: 5rem;
}
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background-color: var(--main-background-color-deep);
  overflow: hidden;
}
.avatar > svg {
  width: 100%;
  height: 100%;
}
.right {
  flex-grow: 1;
}
.nickname {
  font-size: 3rem;
}
.content {
  font-size: 2rem;
}
</style>
