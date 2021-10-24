<template>
  <div class="header">
    <div class="nav">

    </div>
    <div class="profile">
      <user-profile
          v-if="store.state.user.profile"
          :user="store.state.user.profile"
          reverse
      />
      <button v-else class="btn btn-primary" @click="loginWithOsu">
        Login with osu!
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {useStore} from 'vuex'
import UserProfile from '@/components/UserProfile.vue'
import {defineComponent} from 'vue'


export default defineComponent({
  components: {UserProfile},
  setup() {
    const store = useStore()

    function loginWithOsu() {
      open('/login/osu', "_self")
    }

    return {
      store,
      loginWithOsu
    }
  }
})
</script>


<style lang="scss" scoped>

.header {
  display: flex;
  background-color: $gray-300;
  padding: 10px;
  height: 70px;
  align-items: center;

  .nav {
    flex-grow: 1;
  }
}


</style>