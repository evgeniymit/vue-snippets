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
        all: {
          cities: {
             australia: {count: 30, name: "Australia", type: "alphabeticalOrderGroup", value: "australia"},
             boston: {count: 40, name: "Boston", type: "alphabeticalOrderGroup", value: "boston"},
             china: {count: 90, name: "China", type: "alphabeticalOrderGroup", value: "china"},
             dalian: {count: 2, name: "Dalian", type: "alphabeticalOrderGroup", value: "dalian"},
             changshu: {count: 100, name: "Changshu", type: "countOrderGroup", value: "changshu"},
             dubai: {count: 50, name: "Dubai", type: "countOrderGroup", value: "dubai"},
             europe: {count: 20, name: "Europe", type: "countOrderGroup", value: "europe"},
             hunan: {count: 10, name: "Hunan", type: "countOrderGroup", value: "hunan"}
          },
          industries: {
             automotive: {count: 30, name: "Automotive", type: "firstOrderGroup", value: "automotive"},
             aviation: {count: 40, name: "Aviation", type: "firstOrderGroup", value: "aviation"},
             banking: {count: 90, name: "Banking", type: "secondOrderGroup", value: "banking"},
             chemicals: {count: 2, name: "Dalian", type: "secondOrderGroup", value: "chemicals"},
             communications: {count: 100, name: "Communications", type: "secondOrderGroup", value: "communications"},
             compliance: {count: 50, name: "Compliance", type: "thirdOrderGroup", value: "compliance"},
             legal: {count: 20, name: "Legal", type: "thirdOrderGroup", value: "legal"},
             pharmaceuticals: {count: 10, name: "Pharmaceuticals", type: "thirdOrderGroup", value: "pharmaceuticals"}
          }
        }
      },
      userState: {
        details: {currency: 'CNY'}
      },
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

  describe('getItemCollectionSeparatedByGroup', () => {
    describe('get separated ordered grouped collections', () => {
      it("cities", () => {
        const actual = vm.$filters.getItemCollectionSeparatedByGroup('cities', store.state.filters.all);
        const expected = {
           changshu: {count: 100, name: "Changshu", type: "countOrderGroup", value: "changshu"},
           dubai: {count: 50, name: "Dubai", type: "countOrderGroup", value: "dubai"},
           europe: {count: 20, name: "Europe", type: "countOrderGroup", value: "europe"},
           hunan: {count: 10, name: "Hunan", type: "countOrderGroup", value: "hunan"},
           countOrderGroup: {isSeparator: true, $isLabel: true},
           australia: {count: 30, name: "Australia", type: "alphabeticalOrderGroup", value: "australia"},
           boston: {count: 40, name: "Boston", type: "alphabeticalOrderGroup", value: "boston"},
           china: {count: 90, name: "China", type: "alphabeticalOrderGroup", value: "china"},
           dalian: {count: 2, name: "Dalian", type: "alphabeticalOrderGroup", value: "dalian"},
        };
        expect(actual).toEqual(expected);
        expect(dispatchSpy.callCount).toEqual(0);
      });
     it("industries", () => {
        const actual = vm.$filters.getItemCollectionSeparatedByGroup('industries', store.state.filters.all);
        const expected = {
          communications: {count: 100, name: "Communications", type: "secondOrderGroup", value: "communications"},
          aviation: {count: 40, name: "Aviation", type: "firstOrderGroup", value: "aviation"},
          automotive: {count: 30, name: "Automotive", type: "firstOrderGroup", value: "automotive"},
          secondOrderGroup: {isSeparator: true, $isLabel: true},
          banking: {count: 90, name: "Banking", type: "secondOrderGroup", value: "banking"},
          chemicals: {count: 2, name: "Dalian", type: "secondOrderGroup", value: "chemicals"},
          thirdOrderGroup: {isSeparator: true, $isLabel: true},
          compliance: {count: 50, name: "Compliance", type: "thirdOrderGroup", value: "compliance"},
          legal: {count: 20, name: "Legal", type: "thirdOrderGroup", value: "legal"},
          pharmaceuticals: {count: 10, name: "Pharmaceuticals", type: "thirdOrderGroup", value: "pharmaceuticals"}
        };
        expect(actual).toEqual(expected);
        expect(dispatchSpy.callCount).toEqual(0);
      });

    });
  });
});
