<script setup lang="ts">
import { tryUseEditor } from "@/editor/createEditor";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;

  useHistory?: boolean;
}>();

const value = useVModel(props, "modelValue");

const editor = tryUseEditor();

function onFocus() {
  editor?.history.pause()
}

function onBlur() {
  editor?.history.resume()
}

function onEnter() {
  editor?.history.resume()
  editor?.history.pause()
}

</script>

<template>
  <div class="text-input">
    <input type="text" v-model="value" :placeholder="placeholder" :id="id" @focus="onFocus" @blur="onBlur"
      @keydown.enter="onEnter" />
  </div>
</template>

<style lang="stylus" scoped>

@import '../variables';

.text-input
  border-radius 0.25em
  background-color rgba(black, 0.15)
  display flex
  align-items stretch
  box-shadow 0 0 0 0 transparent
  transition box-shadow 0.1s cubic-bezier(0, 0, 0.2, 1)

  &:focus-within
    box-shadow 0 0 0 0.25em rgba(primary, 0.25)

  > input
    flex-grow 1
    padding: 0.5em
    background-color transparent
    border none
    color inherit
    width 100%
    font-size 1.5em
    

    &:focus
      outline none
</style>
