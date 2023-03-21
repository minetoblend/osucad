<template>
  <div class="editor-screen">
    <slot />
  </div>
</template>

<style lang="stylus" scoped>
@import '../../variables'

.editor-screen
  position relative
  width 100%
  height 100%
  overflow hidden
  background-color bg-dark
</style>
