<template>
  <div class="card">
    <div class="cover">
      <img :src="beatmap.covers['list@2x']" alt=""
           onerror="this.src ='https://osu.ppy.sh/assets/images/default-bg.7594e945.png'">
      <div class="beatmap-import-overlay">
        Import
      </div>
    </div>
    <div class="metadata">
      <p class="title">{{ beatmap.title }}</p>
      <p class="artist">{{ beatmap.artist }}</p>
      <div class="difficulties mt-1">
        <span class="difficulty-badge" v-for="difficulty in sortByDifficulty(beatmap.beatmaps)">
          {{ difficulty.version }} ({{ difficulty.difficulty_rating }})
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  props: {
    beatmap: Object
  },
  setup() {
    return {
      sortByDifficulty(values: any[]) {
        return values.slice().sort((a,b) => a.difficulty_rating - b.difficulty_rating)
      }
    }
  }
})

</script>

<style lang="scss" scoped>
.card {
  overflow: hidden;
  display: flex !important;
  flex-direction: row;
  align-items: stretch;
  user-select: none;
  cursor: pointer;

  .cover {
    display: block;
    min-height: 96px;
    width: 96px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      transition: opacity 0.1s linear;
    }

    .beatmap-import-overlay {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      opacity: 0;
      transition: opacity 0.1s linear;
    }
  }

  .metadata {
    padding: 0.5rem;

    p {
      margin: 0;
    }

    .title {
      font-size: 1.2rem;
    }

    .artist {

    }
  }

  .difficulties {
    display: flex;
    flex-wrap: wrap;
    .difficulty-badge {
      background-color: $primary;
      color: white;
      border-radius: 3px;
      margin-right: 0.3rem;
      margin-bottom: 0.3rem;
      padding: 0 0.3rem;
      white-space: nowrap;
    }
  }

  &:hover {
    .beatmap-import-overlay {
      opacity: 1;
    }

    .cover img {
      opacity: 0.5;
    }
  }
}
</style>