<template>
  <div>
    {{ connector.users }}
  </div>
</template>

<script lang="ts">
import {Connector} from "./connector";
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    connector: Connector
  },
  setup({connector}) {

    return {
      connector
    }
  }
})
</script>