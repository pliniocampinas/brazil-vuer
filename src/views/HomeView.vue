<template>
  <div class="home">
    <MapBrowser 
      :isLoading="isLoading" 
      :isOverlayOpen="isOverlayOpen"
      @overlay-close="isOverlayOpen = false"
    >
      <template v-slot:map-overlay>
        <MapBrowserForm @submit="submitMapForm"/>
      </template>

      <template v-slot:map-header>
        <MapBrowserHeader
          :title="activeMap.title"
          @heading-click="headingClick"
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
import { interpolateRdYlGn, scaleQuantile } from "d3";
import MapBrowserFormInputs from '@/interfaces/MapBrowserFormInputs'
import MunicipalitiesData from '@/interfaces/MunicipalitiesData';
import { SourceFormat, ValueType } from '@/interfaces/Enums';

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
    const activeMap = reactive<MapBrowserFormInputs>({
      title: 'Pib per capita 2019',
      sourceUrl: '',
      valueKey: '',
      valueType: ValueType.None,
      sourceFormat: SourceFormat.None,
      cityCodeKey: '',
    })

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

    const headingClick = () => {
      isOverlayOpen.value = true
    }

    const submitMapForm = async (formData: MapBrowserFormInputs) => {
      activeMap.title = formData.title
      activeMap.cityCodeKey = formData.cityCodeKey
      activeMap.sourceFormat = formData.sourceFormat
      activeMap.sourceUrl = formData.sourceUrl
      activeMap.valueKey = formData.valueKey
      activeMap.valueType = formData.valueType
      console.log('submitMapForm', formData)
      await loadData()
      // isOverlayOpen.value = false
    }

    return {
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
      headingClick,
      formatCurrencyBrl,
      loadData,
      pathMapLoaded,
      submitMapForm,
    }
  }
});
</script>
