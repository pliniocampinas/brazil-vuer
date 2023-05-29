<template>
  <div class="municipalities-map" ref="chartContainerElement">
    <div class="municipalities-map__zoom-box">
      <div class="municipalities-map__zoom-button" @click="zoomIn">+</div>
      <div class="municipalities-map__zoom-button" @click="zoomOut">-</div>
    </div>
    <inline-svg 
      :src="require('../assets/municipalities-map.svg')"
      @loaded="svgLoaded"
      @error="svgLoadError($event)"
      fill="black"
      aria-label="Brazil Municipalities Map"
    ></inline-svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import InlineSvg from 'vue-inline-svg';
import svgPanZoom from 'svg-pan-zoom'

interface SvgPanZoomInstance {
  zoomIn: () => void
  zoomOut: () => void
}

export default defineComponent({
  name: 'BrazilMunicipalitiesMap',

  components: {
    InlineSvg,
  },

  props: {
    selectedCityCode: {
      type: String,
      default: null
    },
  },

  setup(props, { emit }) {
    const chartContainerElement = ref(null as HTMLElement | null)
    const pathElementsMap: { [code: string] : Element | null; } = {}
    const panZoomInstance = ref<SvgPanZoomInstance | null>(null)
    
    const svgLoadError = (e: Error) => {
      console.warn('svgLoadError', e)
    }

    const svgLoaded = () => {
      emit('loaded')
      panZoomInstance.value = svgPanZoom('.municipalities-map svg').setZoomScaleSensitivity(0.4)

      if(!chartContainerElement.value) {
        return
      }

      for (const pathElement of chartContainerElement.value.querySelectorAll('path')) {
        const code = pathElement.getAttribute('citycode')
        if(!code) {
          continue
        }
        pathElement.addEventListener('click', () => emit('city-click', code))
        pathElement.addEventListener('touchend', () => emit('city-click', code))
        pathElementsMap[code] = pathElement
      }
      emit('path-map-loaded', pathElementsMap)
    }

    const getPathElement = (code: string) => {
      return chartContainerElement.value?.querySelector(`path[citycode="${code}"]`)
    }

    const zoomIn = () => {
      panZoomInstance.value?.zoomIn()
    }

    const zoomOut = () => {
      panZoomInstance.value?.zoomOut()
    }

    watch(
      () => props.selectedCityCode,
      (code, prevCode) => {
        if(prevCode) {
          const previouslySelectedPathElement = getPathElement(prevCode)
          previouslySelectedPathElement?.classList.remove('map__municipality--selected')
        }
        const selectedPathElement = getPathElement(code)
        selectedPathElement?.classList.add('map__municipality--selected')
      }
    )

    return {
      chartContainerElement,
      svgLoadError,
      svgLoaded,
      zoomIn,
      zoomOut,
    }
  },
});
</script>

<style>
.municipalities-map {
  position: relative;
  max-width: 500px;
  height: 450px;
  border: 1px solid var(--app-secondary-color);
  padding: 8px;
}

.map__municipality {
  stroke: #232323;
  stroke-width: 0;
  cursor: pointer;
}

.map__municipality:hover,
.map__municipality--selected {
  opacity: 0.7;
  stroke-width: 2;
  stroke: #cccccc;
}

.municipalities-map svg {
  width: 100%;
  height: 100%;
}

.municipalities-map__zoom-box {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  height: 76px;
  right: 10px;
  top: 10px;
}

.municipalities-map__zoom-button {
  background-color: var(--app-primary-color);
  color: var(--app-secondary-color);
  border: 1px solid var(--app-secondary-color);
  font-size: 26px;
  font-weight: 600;
  height: 30px;
  width: 30px;
  margin: 4px;
}
</style>