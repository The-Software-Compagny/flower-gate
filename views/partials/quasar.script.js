const app = Vue.createApp({
  setup () {
    return {}
  },
  methods: window.methods,
})

app.use(Quasar, {
  config: {
    dark: 'auto',
    brand: {
      primary: '#1976d2',
      secondary: '#26A69A',
      accent: '#9C27B0',

      dark: '#1d1d1d',
      'dark-page': '#121212',

      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037',
    },
  },
})

Quasar.lang.set(Quasar.lang.fr)
Quasar.iconSet.set(Quasar.iconSet.mdiV6)

app.mount('#q-app')
window.app = app
