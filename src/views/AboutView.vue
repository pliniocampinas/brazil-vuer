<template>
  <div class="app-root">
    <h1 class="my-1 bb-1 py-1">Map Viewer Tools</h1>
    <h2 class="my-1" id="city-name">Select a city</h2>
    <h3 class="my-1 details-header" id="city-details"></h3>
    <div class="map-container">
      <div id="municipalities-map"></div>
    </div>
    <div id="map-labels">
      <!-- Append here -->
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { fetchData as fetchExampleData } from '@/repositories/StaticMunicipalityRepository'
/* eslint @typescript-eslint/no-var-requires: "off" */
const svgColoredMaps = require('svg-colored-maps');

export default {
  setup() {
    const buildParameters = {
      containerSelector: '#municipalities-map', 
      selectedPathClass: 'path--selected',
      onPathClick: (details) => {
        console.log('custom click details:', details)
        if(!mapBuilder.togglePath(details.code)) {
          document.querySelector('#city-name').innerHTML = 'Select a city'
          return
        }
        document.querySelector('#city-name').innerHTML = details.pathElement.getAttribute('description')
      }, 
    }

    const mapBuilder = new svgColoredMaps.MunicipalitiesMapBuilder(buildParameters);
    const colorWithGdp = async () => {
      const sampleData = (await fetchExampleData())
        .map(d => ({
          code: d.code,
          value: d.mainValue
        }))
      
      mapBuilder.colorizeRdYlGn(sampleData)
    }

    onMounted(() => {
      mapBuilder
        .render()
        .then(() => colorWithGdp())
    })

    return {
      colorWithGdp,
    }
  },
}
</script>

<style>
.path--selected {
  fill: #11c1ff;
}
</style>