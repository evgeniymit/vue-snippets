import {filtersFeature} from '@/plugins/filters/index';
import Vue from '@/common/test-helpers/mock-vue';
import Vuex from 'vuex';
import sinon from 'sinon';
import filterGetters from '@/store/modules/filters/getters';
import commonGetters from '@/store/getters';


describe('filtersFeature', () => {
  const mockRouter = {};
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

  let fetchFiltersStub = sinon.stub(vm.$filters, 'getFetchFiltersParams');

  afterAll(() => {
    vm.$filters.getFetchFiltersParams.restore();
  });

  describe('hasActiveFilters', () => {
    it('should return true when there are active filters', () => {
      fetchFiltersStub.returns({cities: {name: 'shanghai'}});
      const actual = vm.$filters.hasActiveFilters();
      expect(Boolean(actual)).toEqual(true);
    });

    it('should return true when there are something in searchState', () => {
      fetchFiltersStub.returns({search: 'test'});
      const actual = vm.$filters.hasActiveFilters();
      expect(Boolean(actual)).toEqual(true);
    });

    it('should return false when there is something in orderingState', () => {
      fetchFiltersStub.returns({ordering: 'test'});
      const actual = vm.$filters.hasActiveFilters();
      expect(Boolean(actual)).toEqual(false);
    });

    it('should return false when there is nothing in searchState, orderingSate and filtersState', () => {
      fetchFiltersStub.returns({});
      const actual = vm.$filters.hasActiveFilters();
      expect(Boolean(actual)).toEqual(false);
    });
  });
});
