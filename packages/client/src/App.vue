<script setup lang="ts">
import { asyncComputed, useAsyncState } from "@vueuse/core";
import { EditorInstance, createEditor } from "./editor/createEditor";
import SetupScreen from "./editor/screens/setup/SetupScreen.vue";
import { ref } from "vue";
import ComposeScreen from "./editor/screens/compose/ComposeScreen.vue";

const editor = ref<EditorInstance>()

createEditor().then((instance) => {
  editor.value = instance
})
</script>

<template>
  <div class="editor" v-if="editor">
    <!-- <SetupScreen :editor="editor" /> -->
    <ComposeScreen/>
    <div class="user-list" v-if="editor">
      Users: {{ editor.client.users.users.length  }}
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.editor
  position: absolute
  width: 100vw
  height: 100vh
  overflow: hidden

  .user-list
    position absolute
    top 0
    right: 0
</style>
