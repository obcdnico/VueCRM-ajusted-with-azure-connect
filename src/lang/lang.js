import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import * as frJson from './fr-FR.json'
import * as enJson from './en-GB.json'

const locale = 'fr-FR'

const messages = {
    'en-GB': enJson,
    'fr-FR': frJson,
}
const i18n = new VueI18n({
    locale: 'fr-FR',
    fallbackLocale: 'fr-FR',
    messages
})

export default i18n
