<template>
  <div class="chat">
    <button class="chat-button" @click="expand">+</button>
    <div class="chat-wrapper" :class="{expanded}">
      <div class="chat-content">
        <ul class="messages">
          <li class="message" v-for="message in messages">
            <div class="profile">
              <div class="avatar" v-if="message.user.avatarUrl">
                <img :src="message.user.avatarUrl" alt="">
              </div>
              <div class="username">
                {{ message.user.displayName }}
              </div>
            </div>
            {{ message.message }}
          </li>
        </ul>
        <div class="compose">
          <input class="form-control" ref="composeField" type="text" v-model.trim="composedMessage" @keydown.enter="sendMessage">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick, ref} from "vue";
import {Connector} from "@/editor/connector";

export default defineComponent({
  props: {
    connector: {
      type: Connector,
      required: true
    }
  },
  setup(props) {
    const expanded = ref(true)
    const composeField = ref<HTMLInputElement | null>(null)
    const composedMessage = ref('')

    const expand = () => {
      expanded.value = !expanded.value
      nextTick(() => {
        composeField.value?.focus()
      })
    }

    const sendMessage = () => {
      if (composedMessage.value.length > 0) {
        props.connector.sendChatMessage(composedMessage.value)
        composedMessage.value = ''
      }
    }

    return {
      expanded,
      expand,
      composeField,
      composedMessage,
      sendMessage,
      messages: props.connector.messages
    }
  }
})
</script>

<style lang="scss" scoped>

$chat-width: 300px;

.chat {
  display: flex;
  align-items: flex-start;

  .compose {
    width: 100%;
    input {
      width: 100%;
    }
  }

  .chat-wrapper {
    width: 0;
    overflow: hidden;
    height: 100%;
    background-color: $gray-300;

    &.expanded {
      width: $chat-width;
    }

    .chat-content {
      width: $chat-width;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }

  .chat-button {
    font-size: 2rem;
    background-color: $gray-300;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px 0 0 10px;
    outline: none;
    border: none;
    color: white;
  }

  .messages {
    list-style: none;
    flex-grow: 1;
    padding: 10px;
    overflow-y: scroll;

    .message {
      width: 100%;
      background-color: $gray-200;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 7px;

      .profile {
        display: flex;

        .avatar {
          width: 32px;
          height: 32px;
          overflow: hidden;
          border-radius: 16px;
          margin-right: 5px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

</style>