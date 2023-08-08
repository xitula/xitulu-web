<!-- 通用方形按钮 -->
<template>
  <div class="btn">
    <el-icon>
      <slot />
    </el-icon>
  </div>
</template>

<style scoped>
@tailwind components;
@layer components {
  .content {
    @apply grow
      overflow-hidden
      whitespace-nowrap
      text-ellipsis
      cursor-default;
  }
  .btn {
    @apply flex
      justify-center
      items-center
      shrink-0
      w-8
      h-8
      border
      border-main-color
      rounded
      cursor-pointer;
  }
}
</style>
