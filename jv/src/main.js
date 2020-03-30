import Vue from 'vue';
import Vuebar from 'vuebar';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import '@/assets/styles/main.scss';

Vue.config.productionTip = false;
Vue.use(Vuebar);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
