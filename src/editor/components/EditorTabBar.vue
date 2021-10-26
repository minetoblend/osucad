<template>
  <div class="tab-bar">
    <button class="tab-button">
      Setup
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    value: String
  }
})
</script>

<style lang="scss" scoped>
.tab-bar {
  .tab-button {
    height: 100%;
    padding: 0 20px;
    background-color: transparent;
    border: none;
    color: white;
  }
}
</style>