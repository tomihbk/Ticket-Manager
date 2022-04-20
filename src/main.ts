import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
// @ts-ignore
import InstantSearch from 'vue-instantsearch'
// @ts-ignore
import VueAutosuggest from 'vue-autosuggest'
// @ts-ignore
import VueSignaturePad from 'vue-signature-pad'

Vue.use(VueSignaturePad)

Vue.use(VueAutosuggest)

Vue.use(InstantSearch)

Vue.config.productionTip = false

// Wait for firebase auth before vue render

let app:Vue

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
