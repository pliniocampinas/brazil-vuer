<template>
  <div class="home">
    <MapBrowser 
      :isLoading="isLoading" 
      :isOverlayOpen="isOverlayOpen"
      @overlay-close="isOverlayOpen = false"
    >
      <template v-slot:map-overlay>
        <MapBrowserForm 
          :errorMessage="errorMessage"
          @submit-error="submitMapError"
          @submit="submitMapForm"
          @reset-map="resetMap"
        />
      </template>

      <template v-slot:map-header>
        <MapBrowserHeader
          :title="activeMap.title"
          @heading-click="isOverlayOpen = true"
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
import { computed, defineComponent, reactive, ref } from 'vue';
import BrazilMunicipalitiesMap from '@/components/BrazilMunicipalitiesMap.vue'; 
import MapBrowser from '@/components/MapBrowser.vue'; 
import MapBrowserForm from '@/components/MapBrowserForm.vue'; 
import MapBrowserHeader from '@/components/MapBrowserHeader.vue'; 
import MapBrowserMunicipalityDetails from '@/components/MapBrowserMunicipalityDetails.vue'; 
import { fetchNameAndState } from '@/repositories/StaticMunicipalityRepository'
import { fetchData } from '@/repositories/RouterRepository'
import { formatCurrencyBrl } from '@/utils/formatters'
import { buildStaticSample } from '@/utils/sampleMapsBuilder'
import { interpolateRdYlGn, scaleQuantile } from "d3";
import MapBrowserFormInputs from '@/interfaces/MapBrowserFormInputs'
import MunicipalitiesData from '@/interfaces/MunicipalitiesData';
import { SourceFormat } from '@/interfaces/Enums';

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
    MapBrowserForm,
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
        mainValue: (municipality?.mainValue?? '') + '',
      }
    })
    const pathElementsMap = ref<{ [code: string] : Element | null;}>({})
    const municipalitiesList = ref<MunicipalitiesData[]>([])
    const isLoading = ref(false)
    const isOverlayOpen = ref(false)
    const staticSample = buildStaticSample()
    const activeMap = reactive<MapBrowserFormInputs>({
      title: staticSample.title,
      sourceUrl: staticSample.sourceUrl,
      valueKey: staticSample.valueKey,
      valueType: staticSample.valueType,
      sourceFormat: staticSample.sourceFormat,
      cityCodeKey: staticSample.cityCodeKey,
    })
    const errorMessage = ref('')

    const pathMapLoaded = (pathMap: { [code: string] : Element | null; }) => {
      pathElementsMap.value = pathMap
      loadData()
        .then(() => colorizePaths())
    }

    const loadData = async () => {
      try {
        isLoading.value = true
        const data = await fetchData({
          sourceUrl: activeMap.sourceUrl,
          valueKey: activeMap.valueKey,
          sourceFormat: activeMap.sourceFormat as SourceFormat,
          cityCodeKey: activeMap.cityCodeKey,
        })
        municipalitiesList.value = data
        errorMessage.value = ''
        isLoading.value = false
      } catch(err) {
        console.log('load data error', err)
        isLoading.value = false
        errorMessage.value = (err as Error).message?? ''
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

    const submitMapForm = async (formData: MapBrowserFormInputs) => {
      activeMap.title = formData.title
      activeMap.cityCodeKey = formData.cityCodeKey
      activeMap.sourceFormat = formData.sourceFormat
      activeMap.sourceUrl = formData.sourceUrl
      activeMap.valueKey = formData.valueKey
      activeMap.valueType = formData.valueType

      await loadData()

      if(errorMessage.value) {
        return
      }

      isOverlayOpen.value = false
      colorizePaths()
    }

    const submitMapError = (message: string) => {
      errorMessage.value = message
    }

    const resetMap = () => {
      isOverlayOpen.value = false
      activeMap.title = staticSample.title
      activeMap.sourceUrl = staticSample.sourceUrl
      activeMap.valueKey = staticSample.valueKey
      activeMap.valueType = staticSample.valueType
      activeMap.sourceFormat = staticSample.sourceFormat
      activeMap.cityCodeKey = staticSample.cityCodeKey
      loadData().then(colorizePaths)
    }

    return {
      errorMessage,
      isLoading,
      isOverlayOpen,
      activeMap,
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
      pathMapLoaded,
      resetMap,
      submitMapForm,
      submitMapError,
    }
  }
});
</script>
