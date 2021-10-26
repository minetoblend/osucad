<template>
  <div class="editor">
    <editor-tab-bar v-model="activeTab" class="tab-bar" />
    <user-list :connector="connector" />
    <chat class="chat" :connector="connector" />
  </div>
</template>

<script lang="ts">
import {Connector} from "./connector";
import {defineComponent, ref} from "vue";
import UserList from "./components/UserList.vue";
import Chat from "@/editor/components/Chat.vue";
import EditorTabBar from "@/editor/components/EditorTabBar.vue";

export default defineComponent({
  components: {
    Chat,
    UserList,
    EditorTabBar
  },
  props: {
    connector: {
      type: Connector,
      required: true
    }
  },
  setup(props) {

    function onVisibilityChange() {
      if (document.visibilityState == "visible") {
        props.connector.setInactive(false)
      } else {
        props.connector.setInactive(true)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const activeTab = ref('setup')

    return {
      connector: props.connector,
      onVisibilityChange,
      activeTab
    }
  },
  beforeUnmount() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  }

})
</script>

<style lang="scss" scoped>
$tab-bar-height: 64px;

.editor {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: $gray-100;

  .tab-bar {
    position: absolute;
    height: $tab-bar-height;
    width: 100%;
    background-color: $gray-200;
  }

  .user-list {
    position: absolute;
    left: 10px;
    top: $tab-bar-height + 10px;
  }

  .chat {
    position: absolute;
    right: 0;
    top: $tab-bar-height;
    bottom: 0;
  }
}
</style>