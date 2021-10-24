<template>
  <div class="home p-2" style="max-width: 1280px; margin: 0 auto">


    <div class="row align-items-stretch" v-if="suggestedBeatmapSets">
      <div class="col-12 text-center my-5">
        <h4 class="text-center mb-4">
          It looks like you have not created any beatmaps so far. You can import existing beatmaps from your osu
          profile.
        </h4>

        <button class="btn btn-lg btn-primary">
          Create beatmap from scratch
        </button>
      </div>
      <div class="col-6 mb-2" v-for="beatmap in suggestedBeatmapSets.beatmapsets">
        <beatmap-set-card class="h-100" :beatmap="beatmap"/>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import axios from "axios"
import {useStore} from "vuex"
import BeatmapSetCard from "@/components/BeatmapSetCard.vue"

export default defineComponent({
  components: {
    BeatmapSetCard
  },
  setup() {
    const suggestedBeatmapSets = ref<any[] | null>(null)

    if (useStore().state.user.profile) {
      axios.get<any>('/user/me/beatmaps').then(res => {
        suggestedBeatmapSets.value = res.data
      })
    }

    return {
      suggestedBeatmapSets
    }
  }
})
</script>

<style>

</style>