<template>
  <div class="home p-2" style="max-width: 1280px; margin: 0 auto">

    <button class="btn btn-lg btn-primary" @click="createBeatmap">
      Create beatmap from scratch
    </button>

    <div class="row align-items-stretch" v-if="existingBeatmapSets">
      <div class="col-6" v-for="beatmapset in existingBeatmapSets">
        <div class="card pointer">
          <div class="card-body">
            {{beatmapset}}
            {{ beatmapset.metadata.title }} / {{ beatmapset.metadata.artist }}
          </div>
        </div>
      </div>
    </div>

    <div class="row align-items-stretch" v-if="suggestedBeatmapSets && false">
      <div class="col-12 text-center my-5">
        <h4 class="text-center mb-4">
          It looks like you have not created any beatmaps so far. You can import existing beatmaps from your osu
          profile.
        </h4>


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
    const existingBeatmapSets = ref<any[] | null>(null)

    const suggestedBeatmapSets = ref<any[] | null>(null)

    if (useStore().state.user.profile) {
      axios.get('/beatmapset').then(res => existingBeatmapSets.value = res.data as any[])
      axios.get<any>('/user/me/beatmaps').then(res => suggestedBeatmapSets.value = res.data)
    }

    function createBeatmap() {
      axios.post('/beatmap/create').then(res => {
        //todo: redirect to editor
      })
    }

    return {
      existingBeatmapSets,
      suggestedBeatmapSets,
      createBeatmap
    }
  }
})
</script>

<style>

</style>