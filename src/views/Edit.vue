<template>
  <div>
    <editor v-if="isConnected" :connector="connector" />
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch, } from "vue";
import {useRoute} from "vue-router";
import {Connector, ConnectorStatus} from "@/editor/connector";
import Editor from "@/editor/Editor.vue";

export default defineComponent({
  components: {Editor},
  setup() {
    const route = useRoute()

    const connector = new Connector(route.params.id as string)

    const isConnected = ref(false)

    watch(connector.status, value => isConnected.value = value === ConnectorStatus.Ready)



    return {
      connector,
      ConnectorStatus,
      isConnected
    }
  },

  beforeUnmount() {
    this.connector.close()
  }

})
</script>