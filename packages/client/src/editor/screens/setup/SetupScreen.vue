<script setup lang="ts">
import TextInput from "@/components/TextInput.vue";
import EditorScreen from "../EditorScreen.vue";
import { ref, watch } from "vue";
import { useEditor } from "@/editor/createEditor";
import { computed } from "@vue/reactivity";
import { QSlider } from "quasar";
import { useKeyModifier } from "@vueuse/core";
import SmoothScroll from "@/components/SmoothScroll.vue";
import CursorOverlay from "@/components/CursorOverlay.vue";

const value = ref("Hello World");

const { metadata, difficulty, history } = useEditor();

const hasMoreThanAscii = (str: string) =>
  [...str].some((char) => char.charCodeAt(0) > 127);

const isShiftPressed = useKeyModifier("Shift");

const artistAscii = computed({
  get: () =>
    metadata.artist?.length > 0
      ? metadata.artist
      : hasMoreThanAscii(metadata.artistUnicode ?? "")
      ? ""
      : metadata.artistUnicode,
  set: (value) => (metadata.artist = value),
});

const titleAscii = computed({
  get: () =>
    metadata.title?.length > 0
      ? metadata.title
      : hasMoreThanAscii(metadata.titleUnicode ?? "")
      ? ""
      : metadata.titleUnicode,
  set: (value) => (metadata.title = value),
});

function onSliderPan(phase: "start" | "end") {
  if (phase === "start") {
    history.pause();
  } else {
    history.resume();
  }
}
</script>

<template>
  <EditorScreen>
    <SmoothScroll>
      <div class="d-flex justify-content-center align-items-center">
        <div class="card" style="max-width: 1000px; position: relative">
          <div class="row align-items-center gy-3">
            <div class="col-12">
              <h3>Metadata</h3>
            </div>
            <div class="col-4">
              <label for="artist">Artist</label>
            </div>
            <div class="col-8">
              <TextInput id="artist" v-model="metadata.artistUnicode" presence-id="metadata.artist" />
            </div>

            <div class="col-4">
              <label for="artistAscii">Artist Romanised</label>
            </div>
            <div class="col-8">
              <TextInput
                id="artistAscii"
                v-model="metadata.artist"
                :placeholder="metadata.artistUnicode"
                presence-id="metadata.artist-ascii"
              />
            </div>

            <div class="col-4">
              <label for="title"> Title </label>
            </div>
            <div class="col-8">
              <TextInput id="title" v-model="metadata.titleUnicode" presence-id="title" />
            </div>

            <div class="col-4">
              <label for="titleAscii">Title Romanised</label>
            </div>

            <div class="col-8">
              <TextInput
                id="titleAscii"
                v-model="metadata.title"
                :placeholder="metadata.titleUnicode"
                
                presence-id="title-ascii"
              />
            </div>

            <div class="col-4">
              <label for="difficultyName"> Difficulty Name </label>
            </div>

            <div class="col-8">
              <TextInput id="difficultyName" v-model="metadata.difficulty" presence-id="difficulty-name" />
            </div>

            <div class="col-12">
              <h3>Difficulty</h3>
            </div>

            <div class="col-4 mt-4">
              <label for="healthDrain"> Health Drain </label>
            </div>
            <div class="col-8 mt-4">
              <QSlider
                id="healthDrain"
                v-model="difficulty.healthDrain"
                :min="0"
                :max="10"
                label
                :step="isShiftPressed ? 0.1 : 0.5"
                snap
                :markers="1"
                @pan="onSliderPan"
              />
            </div>

            <div class="col-4 mt-4">
              <label for="circleSize"> Circle Size </label>
            </div>
            <div class="col-8 mt-4">
              <QSlider
                id="circleSize"
                v-model="difficulty.circleSize"
                :min="0"
                :max="10"
                label
                :step="isShiftPressed ? 0.1 : 0.5"
                snap
                :markers="1"
                @pan="onSliderPan"
              />
            </div>

            <div class="col-4 mt-4">
              <label for="approachRate"> Approach Rate </label>
            </div>
            <div class="col-8 mt-4">
              <QSlider
                id="approachRate"
                v-model="difficulty.approachRate"
                :min="0"
                :max="10"
                label
                :step="isShiftPressed ? 0.1 : 0.5"
                snap
                :markers="1"
                @pan="onSliderPan"
              />
            </div>

            <div class="col-4 mt-4">
              <label for="overallDifficulty"> Overall Difficulty </label>
            </div>
            <div class="col-8 mt-4">
              <QSlider
                id="overallDifficulty"
                v-model="difficulty.overallDifficulty"
                :min="0"
                :max="10"
                label
                :step="isShiftPressed ? 0.1 : 0.5"
                snap
                :markers="1"
                @pan="onSliderPan"
              />
            </div>
          </div>
          <CursorOverlay id="setup-screen" />

        </div>
      </div>
      <div style="height: 100px" />
    </SmoothScroll>
  </EditorScreen>
</template>
