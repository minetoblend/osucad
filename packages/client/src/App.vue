<script setup lang="ts">
import { asyncComputed, useAsyncState } from "@vueuse/core";
import { EditorInstance, createEditor } from "./editor/createEditor";
import SetupScreen from "./editor/screens/setup/SetupScreen.vue";
import { ref } from "vue";

const editor = ref<EditorInstance>()

createEditor().then((instance) => {
  editor.value = instance
})
</script>

<template>
  <div class="editor" v-if="editor">
    <SetupScreen :editor="editor" />
  </div>
</template>

<style lang="stylus" scoped>
.editor
  position: absolute
  width: 100vw
  height: 100vh
  overflow: hidden
</style>
