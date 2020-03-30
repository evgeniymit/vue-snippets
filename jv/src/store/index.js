import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import inventoryManager from './inventory-manager';
import fulfillmentManager from './fulfillment-manager';
import personnel from './personnel';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    inventoryManager,
    fulfillmentManager,
    personnel,
  },
});
