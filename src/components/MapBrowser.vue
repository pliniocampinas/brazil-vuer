<template>
  <div class="map-browser__container">
    <div class="map-browser__loading" v-if="isLoading">
      <LoadingBars/>
    </div>

    <div class="map-browser__overlay" v-if="isOverlayOpen">
      <div class="map-browser__overlay__button" @click="$emit('overlay-close')">
        Voltar
      </div>
      <slot name="map-overlay"></slot>
    </div>

    <div class="map-browser__header">
      <slot name="map-header"></slot>
    </div>

    <div class="map-browser__svg-container">
      <slot name="map-svg"></slot>
    </div>

    <div class="map-browser__details">
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
    isOverlayOpen: {
      type: Boolean,
      default: false
    },
  },
});
</script>

<style>
.map-browser__container {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 500px;
  margin: auto;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  position: relative;
  gap: 6px;
}

.map-browser__svg-container {
  background-color: #414141;
}

.map-browser__loading {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(200, 200, 200, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.map-browser__overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  background-color: var(--app-primary-color);
  border: 1px solid var(--app-secondary-color);
  z-index: 1;
}

.map-browser__overlay__button {
  padding: 4px 10px;
  border: 1px solid var(--app-secondary-color);
  font-weight: 900;
  font-size: 18px;
  text-align: left;
  margin-bottom: 8px;
}

.map-browser__header {
  border: 1px solid var(--app-secondary-color);
  padding: 8px;
}

.map-browser__details {
  border: 1px solid var(--app-secondary-color);
}

@media screen and (min-width: 768px) {
  .map-browser__container {
    display: grid;
    margin: auto;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    position: relative;
  }
}
</style>