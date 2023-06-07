<template>
  <div class="map-browser-form">
    <form class="map-browser-form__form">

      <label class="map-browser-form__label"> <div>Título do mapa</div>
        <input v-model="formInputs.title" class="map-browser-form__input" type="text" placeholder="titulo">
      </label>

      <label class="map-browser-form__label"> <div>URL fonte dos dados</div>
        <input v-model="formInputs.sourceUrl" class="map-browser-form__input" type="text" placeholder="url">
      </label>

      <label class="map-browser-form__label"> <div>Campo chave</div>
        <input v-model="formInputs.valueKey" class="map-browser-form__input" type="valor principal">
      </label>

      <label class="map-browser-form__label" full> <div>Tipo de dado</div>
        <select class="map-browser-form__input" name="valueType" v-model="formInputs.valueType">
          <option 
            v-for="labelValue in valueTypes"
            :key="labelValue.value"
            :value="labelValue.value"
          >{{labelValue.label}}</option>
        </select>
      </label>

      <div v-if="formErrorMessage"  class="map-browser-form__error" full>
        {{formErrorMessage}}
      </div>
      <div 
        class="map-browser-form__button" 
        full
        @click="submit"
      >Salvar</div>

    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import MapBrowserFormInputs from '@/interfaces/MapBrowserFormInputs'

export default defineComponent({
  name: 'MapBrowserForm',

  props: {
    title: {
      type: String,
      default: ''
    },
  },

  setup(props, { emit }) {
    const valueTypes = [
      {
        label: 'Numérico',
        value: 'numeric'
      },
      {
        label: 'Categórico',
        value: 'categoric'
      },
    ]
    const formErrorMessage = ref('')
    const formInputs = reactive<MapBrowserFormInputs>({
      title: '',
      sourceUrl: '',
      valueKey: '',
      valueType: 'numeric',
    })
    watch(() => props.title, () => formInputs.title = props.title?? '')

    onMounted(() => {
      formInputs.title = props.title?? ''
    })

    const submit = () => {
      const formValidation = validateForm()
      if(formValidation.isValid === false) {
        formErrorMessage.value = formValidation.errorMessage
        return
      }
      formErrorMessage.value = ''

      emit('submit', {
        title: formInputs.title,
        sourceUrl: formInputs.sourceUrl,
        valueKey: formInputs.valueKey,
        valueType: formInputs.valueType,
      } as MapBrowserFormInputs)
    }

    const validateForm = (): { isValid: boolean, errorMessage: string } => {
      if(!formInputs.title) {
        return {
          isValid: false,
          errorMessage: 'Título inválido',
        }
      }

      if(!formInputs.sourceUrl) {
        return {
          isValid: false,
          errorMessage: 'Url dos dados inválida',
        }
      }

      if(!formInputs.valueKey) {
        return {
          isValid: false,
          errorMessage: 'Chave inválida',
        }
      }

      if(!formInputs.valueType) {
        return {
          isValid: false,
          errorMessage: 'Tipo de valor inválido',
        }
      }

      return {
        isValid: true,
        errorMessage: '',
      }
    }

    return {
      formErrorMessage,
      formInputs,
      valueTypes,
      submit
    }
  }
});
</script>

<style scoped>
.map-browser-form {
  padding: 8px;
  border: 1px solid var(--app-secondary-color);
}

.map-browser-form__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.map-browser-form__form > *[full] {
  grid-column: span 2;
}

.map-browser-form__label {
  text-align: justify;
  font-size: smaller;
  display: block;
}

.map-browser-form__input {
  display: block;
  width: 100%;
  border: none;
  border-bottom: 1px solid black;
  box-sizing: border-box;
  padding: 4px 2px;
}

.map-browser-form__button {
  position: relative;
  background-color: var(--app-secondary-color);
  border: none;
  font-size: 28px;
  color: #FFFFFF;
  text-align: center;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;
}

.map-browser-form__button:after {
  content: "";
  background: #90EE90;
  display: block;
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px !important;
  margin-top: -120%;
  opacity: 0;
  transition: all 0.6s
}

.map-browser-form__button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transition: 0s
}

.map-browser-form__error {
  color: var(--app-alert-color);
  background-color: #fff;
  border: 2px solid var(--app-alert-color);
  padding: 2px;
  font-weight: 600;
}
</style>