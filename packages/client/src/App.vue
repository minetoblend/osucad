<script setup lang="ts">
import { ObjectNode } from "@osucad/common";
import { computed, ref, watch, watchEffect } from "vue";
import { useEventListener, useMagicKeys, whenever } from "@vueuse/core";
import { Client } from "./editor/client";
const client = new Client();

const box = computed<ObjectNode<{ x: number; y: number }>>(
  () => client.state.getChild("box") as any
);

watchEffect(() => {
  console.log(box.value);
  console.log(client);
  
});

const dragging = ref(false);

watch(dragging, (dragging) => {
  if(dragging) {
    client.history.pause()
  } else {
    client.history.resume()
  }
}, {flush: 'sync'})

useEventListener("mouseup", () => {
  dragging.value = false;
});

useEventListener("mousemove", (evt) => {
  if (dragging.value && box.value) {

    box.value.update({
      x: box.value.get("x") + evt.movementX,
      y: box.value.get("y") + evt.movementY,
    });
  }
});


const keys = useMagicKeys()
whenever(keys.ctrl_z, () => {
  client.history.undo()
})

whenever(keys.ctrl_y, () => {
  client.history.redo()
})

</script>

<template>
  <div class="toolbar">
    <button @click="client.history.undo" :disabled="!client.history.canUndo">Undo</button>
    <button @click="client.history.redo" :disabled="!client.history.canRedo">Redo</button>
  </div>
  <div
    v-if="box"
    class="box"
    :style="{ left: box.get('x') + 'px', top: box.get('y') + 'px' }"
    @mousedown="dragging = true"
  />
</template>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  position: absolute;
}

.toolbar {
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
}
</style>
