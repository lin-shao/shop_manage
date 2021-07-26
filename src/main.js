import Vue from 'vue'
import App from './App'
import router from './router'
import "./assets/css/global.css"
import axios from "axios"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import TreeTable from 'vue-table-with-tree-grid'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(ElementUI);
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config =>{
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
axios.interceptors.response.use(config =>{
  NProgress.done();
  return config
})

Vue.prototype.$http = axios

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
