<script setup lang="ts">
const emit = defineEmits<{
  (e: 'cancel'): void
}>()

function handleCancel() {
  emit('cancel')
}
</script>
<template>
  <div
    class="fixed left-0 top-0 w-screen h-screen flex flex-col justify-center items-center bg-main-background-color/50"
    @click.stop="handleCancel"
  >
    <slot />
  </div>
</template>
