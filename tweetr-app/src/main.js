// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuelidate from 'vuelidate'
import * as moment from 'moment'
import 'moment/locale/pt-br'

Vue.config.productionTip = false
window.axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:3333'

Vue.use(Vuelidate)
Vue.filter('timeAgo', date => moment(date).locale('pt-BR').fromNow())
Vue.filter('joined', date => moment(date).locale('pt-BR').format('MMMM YYYY'))
Vue.filter('dob', date => moment(date).locale('pt-BR').format('MMMM Do YYYY'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
