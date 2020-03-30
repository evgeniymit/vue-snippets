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
      salaryMinState: null,
      salaryMaxState: null,
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

  describe('getFetchFiltersParams', () => {
    beforeEach(() => {
      store.state.activeFiltersState = null;
      store.state.orderingState = null;
      store.state.searchState = null;
    });

    it('should return dict with data from searchState, orderingState and activeFilters', () => {
      store.state.searchState = 'Manager';
      store.state.orderingState = 'relevance';
      store.state.activeFiltersState = {
        cities: {
          shanghai: {name: 'shanghai', value: 'shanghai'},
          kyiv: {name: 'kyiv', value: 'kyiv'}
        }
      };
      const actual = vm.$filters.getFetchFiltersParams();
      const expected = {
        ordering: 'relevance',
        search: 'Manager',
        cities: 'shanghai,kyiv'
      };
      expect(actual).toEqual(expected);
    });

    describe('salary', () => {
      afterEach(() => {
        store.state.salaryMinState = null;
        store.state.salaryMaxState = null;
      });

      it('should set salary_min from salaryMinState', () => {
        store.state.salaryMinState = 100;
        const actual = vm.$filters.getFetchFiltersParams();
        const expected = {salary_min: 100};
        expect(actual).toEqual(expected);
      });

      it('should set salary_max from salaryMaxState', () => {
        store.state.salaryMaxState = 100;
        const actual = vm.$filters.getFetchFiltersParams();
        const expected = {salary_max: 100};
        expect(actual).toEqual(expected);
      });
    });


    it('should not append empty values', () => {
      store.state.activeFiltersState = {
        cities: {
          shanghai: {name: 'shanghai', value: 'shanghai'}
        },
        industries: {}
      };
      store.state.searchState = '';
      store.state.orderingState = null;

      const actual = vm.$filters.getFetchFiltersParams();
      const expected = {cities: 'shanghai'};
      expect(actual).toEqual(expected);
    });
  });
});
