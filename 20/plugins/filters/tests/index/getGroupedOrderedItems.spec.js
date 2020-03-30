import {filtersFeature} from '@/plugins/filters/index';
import Vue from '@/common/test-helpers/mock-vue';
import Vuex from 'vuex';
import sinon from 'sinon';
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

  let dispatchSpy = sinon.spy(store, 'dispatch');

  afterAll(() => {
    store.dispatch.restore();
  });

  describe('getGroupedOrderedItems', () => {
    describe('common filter should be grouped into default group and ordered by name', () => {
      it("should return filter items grouped into one group since there's no type", () => {
        const allFilters = {

          singapore: {name: 'Singapore', value: 'singapore', count: 100, type: 'topCity'},
          beijing: {name: 'Beijing', value: 'beijing', count: 1000, type: 'topCity'},
          shanghai: {name: 'Shanghai', value: 'shanghai', count: 10, type: 'topCity'},

          london: {name: 'London', value: 'london', count: 20, type: 'restCity'},
          kyiv: {name: 'Kyiv', value: 'kyiv', count: 100, type: 'restCity'},
          zp: {name: 'Zp', value: 'zp', count: 20, type: 'restCity'}
        };
        const actual = vm.$filters.getGroupedOrderedItems('cities', allFilters);
        const expected = {
          topCity: {
            beijing: {name: 'Beijing', value: 'beijing', count: 1000, type: 'topCity'},
            singapore: {name: 'Singapore', value: 'singapore', count: 100, type: 'topCity'},
            shanghai: {name: 'Shanghai', value: 'shanghai', count: 10, type: 'topCity'}
          },
          restCity: {
            kyiv: {name: 'Kyiv', value: 'kyiv', count: 100, type: 'restCity'},
            london: {name: 'London', value: 'london', count: 20, type: 'restCity'},
            zp: {name: 'Zp', value: 'zp', count: 20, type: 'restCity'}
          }
        };
        expect(actual).toEqual(expected);
        expect(dispatchSpy.callCount).toEqual(0);
      });
    });

    describe('tags filter should be grouped into groups by type and ordered by relevance (hardcoded)', () => {
      it('should return filter items grouped by type', () => {
        const allFilters = {
          active: {
            name: 'Active',
            value: 'active',
            count: 10,
            type: 'status'
          },
          internal: {
            name: 'Int',
            value: 'internal',
            count: 100,
            type: 'status'
          },
          month: {name: 'Month', value: 'month', count: 0, type: 'updated'},
          week: {name: 'Week', value: 'week', count: 0, type: 'updated'},
          day: {name: 'Day', value: 'day', count: 20, type: 'updated'},
          coi: {name: 'Coi', value: 'coi', count: 200, type: 'coi'}
        };
        const actual = vm.$filters.getGroupedOrderedItems('tags', allFilters);
        const expected = {
          coi: {
            coi: {
              name: 'Coi',
              value: 'coi',
              count: 200,
              type: 'coi',
              relevance: 0
            }
          },
          status: {
            active: {
              name: 'Active',
              value: 'active',
              count: 10,
              type: 'status',
              relevance: 1
            },
            internal: {
              name: 'Int',
              value: 'internal',
              count: 100,
              type: 'status',
              relevance: 2
            }
          },
          updated: {
            month: {
              name: 'Month',
              value: 'month',
              count: 0,
              type: 'updated',
              relevance: 5
            },
            week: {
              name: 'Week',
              value: 'week',
              count: 0,
              type: 'updated',
              relevance: 4
            },
            day: {
              name: 'Day',
              value: 'day',
              count: 20,
              type: 'updated',
              relevance: 3
            }
          }
        };
        expect(actual).toEqual(expected);
        expect(dispatchSpy.callCount).toEqual(0);
      });
    });
  });
});
