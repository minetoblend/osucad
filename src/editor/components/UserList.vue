<template>
  <ul class="user-list">
    <li v-for="(user, index) in users" class="user" :class="{inactive: isInactive(user)}" :key="index">
      <div class="avatar">
        <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="">
      </div>
      {{ user.displayName }}
    </li>
  </ul>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Connector, SerializedUser} from "@/editor/connector";

export default defineComponent({
  props: {
    connector: {type: Connector, required: true}
  },
  setup(props) {
    return {
      users: props.connector.users,
      isInactive(user: SerializedUser) {
        return props.connector.inactiveUsers?.value.some(it => it === user.uuid) || false
      }
    }
  }
})
</script>

<style lang="scss" scoped>

$avatar-size: 48px;

.user-list {
  list-style: none;
  padding: 0;

  > .user {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .avatar {
      width: $avatar-size;
      height: $avatar-size;
      overflow: hidden;
      border-radius: $avatar-size * 0.5;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &.inactive {
      opacity: 0.5;
    }
  }
}
</style>