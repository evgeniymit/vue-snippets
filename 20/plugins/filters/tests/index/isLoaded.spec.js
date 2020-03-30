import {filtersFeature} from '@/plugins/filters/index';
import Vue from '@/common/test-helpers/mock-vue';
import Vuex from 'vuex';
import filterGetters from '@/store/modules/filters/getters';
import commonGetters from '@/store/getters';


describe('filtersFeature', () => {
  let template, vm, store;

  store = new Vuex.Store({
    state: {
      orderingState: null,
      searchState: null,
      activeFiltersState: null,
      filters: {
        loading: false,
        error: null,
        all: null
      },
      userState: {
        details: {currency: 'CNY'}
      }
    },
    getters: {
      ...filterGetters,
      ...commonGetters,
    }
  });

  template = `<div id="app"></div>`;
  vm = new Vue({template, store}).$mount();
  Vue.use(filtersFeature, {store});

  describe('isLoaded', () => {
    it('should be false when filters list is empty', () => {
      store.state.filters.all = [];
      let isLoaded = vm.$filters.isLoaded();
      expect(isLoaded).toEqual(false);
    });
    it('should be false when filters list is null', () => {
      store.state.filters.all = null;
      let isLoaded = vm.$filters.isLoaded();
      expect(isLoaded).toEqual(false);
    });
    it('should be true when filters list contains something', () => {
      store.state.filters.all = {test: 'test'};
      let isLoaded = vm.$filters.isLoaded();
      expect(isLoaded).toEqual(true);
    });
  });
});
