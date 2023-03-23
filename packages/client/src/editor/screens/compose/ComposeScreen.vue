<script setup lang="ts">
import { useEditor } from "@/editor/createEditor";
import EditorScreen from "../EditorScreen.vue";
import EditorViewport from "./EditorViewport.vue";
import {Application} from "pixi.js";

const {} = useEditor();


</script>

<template>
  <EditorScreen>
    <EditorViewport />
  </EditorScreen>
</template>