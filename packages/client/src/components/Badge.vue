<script setup lang="ts">
const props = defineProps<{
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}>();
</script>

<template>
  <div class="badge" :class="corner">
    <slot />
  </div>
</template>

<style lang="stylus" scoped>
@import '../variables';

.badge
  border-radius 0.5em
  background-color primary
  color white
  width fit-content

  &.absolute
    position absolute


</style>