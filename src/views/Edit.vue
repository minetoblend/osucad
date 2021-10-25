<template>
  <div>
    <editor v-if="connector.status.value === ConnectorStatus.Ready" :connector="connector" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useRoute} from "vue-router";
import {Connector, ConnectorStatus} from "@/editor/connector";
import Editor from "@/editor/Editor.vue";

export default defineComponent({
  components: {Editor},
  setup() {
    const route = useRoute()

    const connector = new Connector(route.params.id as string)

    return {
      connector,
      ConnectorStatus
    }
  }
})
</script>