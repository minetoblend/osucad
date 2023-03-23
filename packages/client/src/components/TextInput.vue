<script setup lang="ts">
import { tryUseEditor } from "@/editor/createEditor";
import { computed } from "@vue/reactivity";
import { useVModel } from "@vueuse/core";
import { watchEffect } from "vue";

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;

  useHistory?: boolean;

  presenceId?: string;
}>();

const value = useVModel(props, "modelValue");

const editor = tryUseEditor();

function onFocus() {
  editor?.history.pause();
  if (props.presenceId && editor) {
    editor.presence.current.value.component = {
      id: props.presenceId,
    };
  }
}

function onBlur() {
  editor?.history.resume();

  setTimeout(() => {
    if (
      props.presenceId &&
      editor &&
      editor.presence.current.value.component?.id === props.presenceId
    ) {
      editor.presence.current.value.component = null;
    }
  }, 250);
}

function onEnter() {
  editor?.history.resume();
  editor?.history.pause();
}

const editingUsers = computed(() => {
  if (!props.presenceId) return [];
  return (
    editor?.client.users.users.value.filter(
      (user) => user.data.component?.id === props.presenceId
    ) ?? []
  );
});
</script>

<template>
  <div class="text-input">
    <input
      type="text"
      v-model="value"
      :placeholder="placeholder"
      :id="id"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="onEnter"
    />
    <div class="presence-indicator">
      <TransitionGroup name="user">
        <div
          v-for="user in editingUsers"
          class="user"
          :style="{ backgroundColor: user.color }"
          :key="user.id"
        />
      </TransitionGroup>
    </div>
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
  position relative

  // &:focus-within
  //   box-shadow 0 0 0 0.25em rgba(primary, 0.25)

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
  .presence-indicator
    position absolute
    bottom 0
    left 0
    right 0
    height 3px
    display flex
    pointer-events none
    justify-content center

    .user
      flex-grow 1
      height: 3px

      &-enter-active, &-leave-active
        transition flex-grow 0.15s cubic-bezier(0, 0, 0.2, 1)

      &-enter-from, &-leave-to
        flex-grow 0
</style>
