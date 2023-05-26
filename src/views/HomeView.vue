<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <BrazilMunicipalitiesMap
      class="map__municipalities__map"
      :selectedCityCode="selectedCityCode"
      @city-click="cityClick"
      @path-map-loaded="pathMapLoaded"
    >
    </BrazilMunicipalitiesMap>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import BrazilMunicipalitiesMap from '@/components/BrazilMunicipalitiesMap.vue'; 

export default defineComponent({
  name: 'HomeView',
  components: {
    BrazilMunicipalitiesMap,
  },
  setup() {
    const selectedCityCode = ref('')
    const pathElementsMap = ref<{ [code: string] : Element | null;}>({})

    const pathMapLoaded = (pathMap: { [code: string] : Element | null; }) => {
      pathElementsMap.value = pathMap
      // loadData()
      //   .then(() => colorizePaths())
    }

    return {
      selectedCityCode,
      cityClick: (code: string) => {
        if(selectedCityCode.value == code) {
          selectedCityCode.value = ''
          return
        }
        selectedCityCode.value = code;
      },
      pathMapLoaded
    }
  }
});
</script>
