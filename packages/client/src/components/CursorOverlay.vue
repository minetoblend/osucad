<script setup lang="ts">
import { useEditor } from "@/editor/createEditor";
import { PresenceData } from "@osucad/common";
import { useMouse, useMouseInElement, usePointer, useRafFn } from "@vueuse/core";
import { defineComponent, h, ref, watchEffect } from "vue";
import Cursor from "./Cursor.vue";

const props = defineProps<{
  id: string;
}>();

const { presence, client } = useEditor();
const container = ref();

const { x, y } = usePointer();

watchEffect(() => {
  if(!container.value) return;
  const bounds = container.value.getBoundingClientRect();

  presence.current.value.cursor = {
    container: props.id,
    position: {
      x: x.value - bounds.left,
      y: y.value - bounds.top,
    },
  };
});
const users = client.users.users;
</script>

<template>
  <div ref="container" class="cursor-container">
    <template v-for="user in users">
      <Cursor
        v-if="!user.isSelf && user.data.cursor?.container === props.id"
        :presence="user"
      />
    </template>
  </div>
</template>

<style lang="stylus" scoped>
.cursor-container
  position absolute
  inset 0
  pointer-events none
</style>
