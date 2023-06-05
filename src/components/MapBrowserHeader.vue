<template>
  <div class="map-browser-header">
    <h3 class="map-browser-header__heading">
    {{ title }}
    </h3>
    <div class="map-browser-header__button" @click="$emit('heading-click')">
      +
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MapBrowserHeader',

  props: {
    title: {
      type: String,
      default: ''
    },
  },
});
</script>

<style>
.map-browser-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-browser-header__heading {
  margin: 0;
}

.map-browser-header__button {
  padding: 4px 10px;
  border: 1px solid var(--app-secondary-color);
  font-weight: 900;
  font-size: 18px;
}
</style>