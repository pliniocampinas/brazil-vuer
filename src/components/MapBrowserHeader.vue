<template>
  <div class="map-browser-header">
    <h3 class="map-browser-header__heading">
    {{ title }}
    </h3>
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
.map-browser-header__heading {
  margin: 0;
}
</style>