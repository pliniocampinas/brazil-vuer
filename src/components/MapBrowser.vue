<template>
  <div class="map__browser__container">
    <div class="map__browser__loading" v-if="isLoading">
      <LoadingBars/>
    </div>

    <div class="map__browser__svg-container">
      <slot name="map-svg"></slot>
    </div>

    <div class="map__browser__details">
      <slot name="browser-details"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoadingBars from '@/components/LoadingBars.vue';

export default defineComponent({
  name: 'MapBrowser',

  components: {
    LoadingBars,
  },

  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
  },
});
</script>

<style>
.map__browser__container {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 500px;
  margin: auto;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  position: relative;
}

.map__browser__svg-container {
  background-color: #414141;
}

.map__browser__loading {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(200, 200, 200, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.map__browser__details {
  border: 1px solid var(--app-secondary-color);
}

@media screen and (min-width: 768px) {
  .map__browser__container {
    display: grid;
    margin: auto;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    position: relative;
  }
}
</style>