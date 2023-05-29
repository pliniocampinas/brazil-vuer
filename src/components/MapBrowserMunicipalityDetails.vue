<template>
  <div class="map-browser-municipality-details">
    <h4>Município</h4>
    <template v-if="cityName">
      <p><strong>Nome:</strong> {{ cityName }}</p>
      <p><strong>Valor:</strong> {{ mainValue }}</p>
    </template>
    <template v-else>
      <p>
        Selecione uma cidade para ver detalhes
      </p>
      <p style="visibility: hidden;">Placeholder</p>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MapBrowserMunicipalityDetails',
  props: {
    cityName: {
      type: String,
      default: ''
    },
    mainValue: {
      type: String,
      default: ''
    },
  },
});
</script>