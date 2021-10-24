<template>
  <template v-if="initialized">
    <page-header/>
    <router-view/>
  </template>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import store from "@/store";
import {ref} from "vue";

export default {
  components: {PageHeader},
  setup() {
    const initialized = ref(false)
    store.dispatch('init').then(() => initialized.value = true)
    return {initialized}
  }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';

#app {
  font-family: 'Saira Condensed', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: $gray-100;
  color: white;
  margin: 0;
  overflow-x: hidden;
}

h4 {
  font-weight: 100;
}
</style>
