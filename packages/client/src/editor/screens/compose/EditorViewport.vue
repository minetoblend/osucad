<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import { Application, Container } from "pixi.js";
import { onMounted, ref, watchEffect } from "vue";
import { ToolContext } from "./tools/ctx";
import { CircleTool } from "./tools/circleTool";

const container = ref();
const app = new Application();

const { width: containerWidth, height: containerHeight } =
  useElementSize(container);

watchEffect(() =>
  app.renderer.resize(containerWidth.value, containerHeight.value)
);

onMounted(() => {
  container.value.appendChild(app.view);
});

const overlayContainer = new Container();
app.stage.addChild(overlayContainer);

const tool = CircleTool(new ToolContext(
  app.stage,
  overlayContainer
));
</script>

<template>
  <div ref="container" class="viewport-container"></div>
</template>

<style lang="stylus" scoped>
.viewport-container
  position: absolute
  width: 100%
  height: 100%
  overflow hidden
</style>
