<template>
  <div class="home">
    <BrazilMunicipalitiesMap
      :selectedCityCode="selectedCityCode"
      @city-click="cityClick"
      @path-map-loaded="pathMapLoaded"
    >
    </BrazilMunicipalitiesMap>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BrazilMunicipalitiesMap from '@/components/BrazilMunicipalitiesMap.vue'; 
import { fetchData } from '@/repositories/MunicipalityRepository'
import { interpolateRdYlGn, scaleQuantile } from "d3";
import MunicipalitiesData from '@/interfaces/MunicipalitiesData';

const getColorFunction = (dataset: number[]) => {
  // Between [0, 1], 5 numbers for 5 tones.
  const scaleOfColor = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  const interpolator = interpolateRdYlGn
  const colors = scaleOfColor.map(x => interpolator(x))

  const getColor = scaleQuantile<string, number>()
    .domain(dataset)
    .range(colors)

  return getColor
}

export default defineComponent({
  name: 'HomeView',
  components: {
    BrazilMunicipalitiesMap,
  },
  setup() {
    const selectedCityCode = ref('')
    const pathElementsMap = ref<{ [code: string] : Element | null;}>({})
    const municipalitiesList = ref<MunicipalitiesData[]>([])

    const pathMapLoaded = (pathMap: { [code: string] : Element | null; }) => {
      pathElementsMap.value = pathMap
      loadData()
        .then(() => colorizePaths())
    }

    const loadData = async () => {
      try {
        const data = await fetchData()
        municipalitiesList.value = data
      } catch(err) {
        console.log('load data error', err)
      }
    }

    const colorizePaths = () => {
      const mainValues = municipalitiesList.value
        .map(municipality => municipality.mainValue)
      const getColor = getColorFunction(mainValues)
      municipalitiesList.value.forEach(d => {
        const color = getColor(d.mainValue)
        if(!d.pathElement) {
          d.pathElement = pathElementsMap.value[d.code]
        }
        if(d.pathElement) {
          d.pathElement.setAttribute("fill", color+'')
        }
      })
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
      loadData,
      pathMapLoaded
    }
  }
});
</script>
