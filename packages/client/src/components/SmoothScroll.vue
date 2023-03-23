<script setup lang="ts">
import {
  TransitionPresets,
  useElementSize,
  useEventListener,
  useTransition,
} from "@vueuse/core";
import { computed, nextTick, ref, watch } from "vue";

const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

const { height: containerHeight } = useElementSize(container);
const { height: contentHeight } = useElementSize(content);

const scroll = ref(0);
const transitionDisabled = ref(false);
const smoothScroll = useTransition(scroll, {
  duration: 200,
  transition: TransitionPresets.easeInOutCubic,
  disabled: transitionDisabled,
});

const ratio = computed(() => {
  if (containerHeight.value === 0) return 0;
  return containerHeight.value / contentHeight.value;
});

const showScrollbar = computed(() => ratio.value < 1);

useEventListener(container, "wheel", (evt: WheelEvent) => {
  scroll.value = Math.max(
    0,
    Math.min(
      scroll.value + evt.deltaY,
      contentHeight.value - containerHeight.value
    )
  );
});

watch([containerHeight, contentHeight], () => {
  transitionDisabled.value = true;
  scroll.value = Math.max(
    0,
    Math.min(scroll.value, contentHeight.value - containerHeight.value)
  );
  nextTick(() => (transitionDisabled.value = false));
});
</script>

<template>
  <div ref="container" class="scroll-container">
    <div ref="content" class="content" :style="{ top: -smoothScroll + 'px' }">
      <slot />
    </div>
    <div
      v-if="showScrollbar"
      class="scrollbar"
      :style="{
        height: ratio * 90 + '%',
        top: ((smoothScroll / contentHeight) * 90 + 5) + '%',
      }"
    />
  </div>
</template>

<style lang="stylus" scoped>
.scroll-container
  overflow hidden
  width 100%
  height 100%

  position: relative
  
  .content
    position: absolute
    width 100%

  .scrollbar
    position: absolute
    right 0
    width 10px
    background: rgba(white, 0.2)
    border-radius 5px
    cursor pointer
</style>
