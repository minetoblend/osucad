<script setup lang="ts">
import { Presence } from "@/editor/users";
import { PresenceData } from "@osucad/common";
import { computed } from "@vue/reactivity";
import { unrefElement, useRafFn } from "@vueuse/core";
import { onMounted, ref, watchEffect } from "vue";

const props = defineProps<{
  presence: Presence;
}>();

let x = props.presence.data.cursor!.position.x;
let y = props.presence.data.cursor!.position.y;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const el = ref<HTMLDivElement>();

useRafFn(({ delta }) => {
  const newX = lerp(
    x,
    props.presence.data.cursor!.position.x,
    Math.min(delta * 10, 1)
  );
  const newY = lerp(
    y,
    props.presence.data.cursor!.position.y,
    Math.min(delta * 10, 1)
  );
  if (Math.abs(newX - x) > 1 || Math.abs(newY - y) > 1) {
    x = newX;
    y = newY;
    unrefElement(el)!.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
  }
});

onMounted(() => {
  unrefElement(el)!.style.transform = `translate(${x}px, ${y}px)`;
});

const color = computed(() => {
  return props.presence.color;
});
</script>
<template>
  <svg
    ref="el"
    class="cursor"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.6719 19.6409L4.69258 4.69258L19.6409 10.6719L14.1 12.5189C13.3535 12.7677 12.7677 13.3535 12.5189 14.1L10.6719 19.6409Z"
      fill="currentColor"
      fill-opacity="0.4"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="11.4737"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style lang="stylus" scoped>
.cursor
  position absolute

  width 32px
  height 32px
  transition transform 0.1s ease-out
  color: v-bind(color)
</style>
