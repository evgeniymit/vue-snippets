import {filtersFeature} from '@/plugins/filters/index';
import Vue from '@/common/test-helpers/mock-vue';
import Vuex from 'vuex';
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

  describe('getNotActiveFilters', () => {
    beforeEach(() => {
      store.state.activeFiltersState = {
        salaries: {
          bellow_400k: {value: 'bellow_400k', name: 'Bellow 400k'},
          '400k_600k': {value: '400k_600k', name: '400k_600k'}
        },
        tags: {
          month: {value: 'month', name: 'Month', tag_type: 'updated'}
        }
      };
      store.state.filters.all = {
        salaries: {
          bellow_400k: {value: 'bellow_400k', name: 'Bellow 400k'},
          '400k_600k': {value: '400k_600k', name: '400k_600k'},
          '600k_800k': {value: '600k_800k', name: '600k_800k'},
          '800k_1m': {value: '800k_1m', name: '800k_1m'},
          '1_1d3_m': {value: '1_1d3_m', name: '1_1d3_m'},
          '1d3_1d6_m': {value: '1d3_1d6_m', name: '1d3_1d6_m'},
          '1d6_1d9_m': {value: '1d6_1d9_m', name: '1d6_1d9_m'},
          '1d9_2d2_m': {value: '1d9_2d2_m', name: '1d9_2d2_m'},
          '2d2_2d5_m': {value: '2d2_2d5_m', name: '2d2_2d5_m'},
          '2d5_m_plus': {value: '2d5_m_plus', name: '2d5_m_plus'}
        },
        tags: {
          month: {value: 'month', name: 'Month', tag_type: 'updated'},
          week: {value: 'week', name: 'Week', tag_type: 'updated'},
          day: {value: 'day', name: 'Day', tag_type: 'updated'}
        }
      };
    });

    it('should return not active filters for tags', () => {
      const filterType = 'tags';
      const actual = vm.$filters.getNotActiveFilters(filterType);
      const expected = {
        week: {value: 'week', name: 'Week', tag_type: 'updated'},
        day: {value: 'day', name: 'Day', tag_type: 'updated'}
      };
      expect(actual).toEqual(expected);
    });

    it('should return not active filters for salaries', () => {
      const filterType = 'salaries';
      const actual = vm.$filters.getNotActiveFilters(filterType);
      const expected = {
        '600k_800k': {value: '600k_800k', name: '600k_800k'},
        '800k_1m': {value: '800k_1m', name: '800k_1m'},
        '1_1d3_m': {value: '1_1d3_m', name: '1_1d3_m'},
        '1d3_1d6_m': {value: '1d3_1d6_m', name: '1d3_1d6_m'},
        '1d6_1d9_m': {value: '1d6_1d9_m', name: '1d6_1d9_m'},
        '1d9_2d2_m': {value: '1d9_2d2_m', name: '1d9_2d2_m'},
        '2d2_2d5_m': {value: '2d2_2d5_m', name: '2d2_2d5_m'},
        '2d5_m_plus': {value: '2d5_m_plus', name: '2d5_m_plus'}
      };
      expect(actual).toEqual(expected);
    });
  });
});
