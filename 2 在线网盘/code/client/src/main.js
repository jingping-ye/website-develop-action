// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import http from './utils/http';

import ElementUI from 'element-ui';
import VueContextMenu from '@xunlei/vue-context-menu'
import VueClipboard from 'vue-clipboard2'
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/style/style.css";
Vue.prototype.$http = http;

Vue.config.productionTip = false;
Vue.use(ElementUI)
Vue.use(VueContextMenu)
Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
