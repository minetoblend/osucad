<template>
  <div class="profile-wrapper">
    <div v-if="user" class="profile" :class="{reverse}">
      <div class="avatar" v-if="user.avatarUrl">
        <img :src="user.avatarUrl" :alt="`${user.displayName}'s profile avatar`">
      </div>
      <div class="display-name">
        {{ user.displayName }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: Object,
  reverse: Boolean
})

</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  align-items: center;

  .avatar {
    width: $profile-avatar-size ;
    height: $profile-avatar-size;
    border-radius: $profile-avatar-size * .5;
    overflow: hidden;
    margin-right: $profile-inner-margin;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .display-name {

  }

  &.reverse {
    .display-name {
      order: 1;
      margin-right: $profile-inner-margin;
    }
    .avatar {
      order: 2;
      margin-right: 0;
    }
  }
}
</style>