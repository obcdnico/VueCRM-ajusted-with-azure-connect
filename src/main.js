// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from '@/router'
import store from '@/store'
import api from './utils/backend-api'
import appUtil from './utils/app-util'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

import VueProgressBar from 'vue-progressbar'

import i18n from './lang/lang.js'

const options = {
  color: '#DDDDDD',
  failedColor: '#FF4136',
  thickness: '5px',
  transition: {
    speed: '0.1s',
    opacity: '0.5s',
    termination: 400
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

Vue.use(VueMaterial)
Vue.use(Vuetify, {
  theme:
    {
      primary: '#2ECC40',
      secondary: '#424242',
      accent: '#82B1FF',
      error: '#FF4136',
      info: '#2196F3',
      success: '#43A047',
      warning: '#FFC107'
    }
})
Vue.config.productionTip = false

window.Store = store
Vue.prototype.api = api
Vue.prototype.appUtil = appUtil

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
  // template: '<App/>',
  // components: { App }
})
