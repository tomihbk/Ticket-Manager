import Vue from 'vue'
// @ts-ignore
import Vuetify from 'vuetify'
// @ts-ignore
import fr from 'vuetify/lib/locale/fr'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { fr },
    current: 'fr'
  }
})
