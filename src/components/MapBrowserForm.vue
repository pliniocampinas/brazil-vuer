<template>
  <div class="map-browser-form">
    <form class="map-browser-form__form">
      <label class="map-browser-form__label"> <div>Título do mapa</div>
        <input v-model="innerTitle" class="map-browser-form__input" type="text" placeholder="titulo">
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
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'MapBrowserForm',

  props: {
    title: {
      type: String,
      default: ''
    },
  },
  setup(props, { emit }) {
    const formErrorMessage = ref('')
    const innerTitle = ref('')
    watch(() => props.title, () => innerTitle.value = props.title?? '')

    onMounted(() => {
      innerTitle.value = props.title?? ''
    })

    const submit = () => {
      if(formIsValid() === false) {
        formErrorMessage.value = 'Form is invalid!'
        return
      }
      formErrorMessage.value = ''

      emit('submit', {
        title: innerTitle.value
      })
    }

    const formIsValid = () => {
      if(!innerTitle.value) {
        return false
      }

      return true
    }

    return {
      formErrorMessage,
      innerTitle,
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
  gap: 6px;
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