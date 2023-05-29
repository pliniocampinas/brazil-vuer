<template>
  <div class="home">
    <MapBrowser :isLoading="isLoading">
      <template v-slot:map-header>
        <MapBrowserHeader
          :title="mapName"
        />
      </template>

      <template v-slot:map-svg>
        <BrazilMunicipalitiesMap
          :selectedCityCode="selectedCityCode"
          @city-click="cityClick"
          @path-map-loaded="pathMapLoaded"
        >
        </BrazilMunicipalitiesMap>
      </template>

      <template v-slot:browser-details>
        <MapBrowserMunicipalityDetails
          :cityName="selectedCity.cityName"
          :mainValue="selectedCity.mainValue"
        />
      </template>
    </MapBrowser>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import BrazilMunicipalitiesMap from '@/components/BrazilMunicipalitiesMap.vue'; 
import MapBrowser from '@/components/MapBrowser.vue'; 
import MapBrowserHeader from '@/components/MapBrowserHeader.vue'; 
import MapBrowserMunicipalityDetails from '@/components/MapBrowserMunicipalityDetails.vue'; 
import { fetchData, fetchNameAndState } from '@/repositories/MunicipalityRepository'
import { formatCurrencyBrl } from '@/utils/formatters'
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
    MapBrowser,
    MapBrowserHeader,
    MapBrowserMunicipalityDetails,
  },
  setup() {
    const selectedCityCode = ref('')
    const selectedCity = computed(() => {
      const nameAndState = fetchNameAndState(selectedCityCode.value)
      const municipality = municipalitiesList.value.find(m => m.code === selectedCityCode.value)
      return {
        cityName: nameAndState?.name?? '',
        stateAcronym: nameAndState?.stateAcronym?? '',
        mainValue: municipality?.mainValue?? 0,
      }
    })
    const pathElementsMap = ref<{ [code: string] : Element | null;}>({})
    const municipalitiesList = ref<MunicipalitiesData[]>([])
    const isLoading = ref(false)
    const mapName = ref('Pib per capita 2019')

    const pathMapLoaded = (pathMap: { [code: string] : Element | null; }) => {
      pathElementsMap.value = pathMap
      loadData()
        .then(() => colorizePaths())
    }

    const loadData = async () => {
      try {
        isLoading.value = true
        const data = await fetchData()
        municipalitiesList.value = data
        isLoading.value = false
      } catch(err) {
        console.log('load data error', err)
        isLoading.value = false
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
      isLoading,
      mapName,
      selectedCityCode,
      selectedCity,
      cityClick: (code: string) => {
        if(selectedCityCode.value == code) {
          selectedCityCode.value = ''
          return
        }
        selectedCityCode.value = code;
      },
      formatCurrencyBrl,
      loadData,
      pathMapLoaded
    }
  }
});
</script>
