import {filtersFeature} from '@/plugins/filters/index';
import Vue from '@/common/test-helpers/mock-vue';
import Vuex from 'vuex';
import filterGetters from '@/store/modules/filters/getters';
import commonGetters from '@/store/getters';
Vue.use(Vuex);

describe('getMarkActiveRecursive', () => {
  let template, vm, store;

  store = new Vuex.Store({
    state: {
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

  it('should return all filters and set isActive property', () => {
    const allFilters = {
      internet: {
        count: 8,
        name: 'Internet',
        value: 'internet',
        parentBranch: '',
        children: {
          backstage: {
            count: 4,
            name: 'Backstage',
            value: 'backstage',
            parentBranch: 'internet',
            children: {
              java: {
                count: 1,
                name: 'Java Engineer',
                value: 'java',
                children: {},
                parentBranch: 'internet.backstage'
              },
              php: {
                count: 1,
                name: 'PHP',
                value: 'php',
                children: {},
                parentBranch: 'internet.backstage'
              },
              python: {
                count: 2,
                name: 'Python',
                value: 'python',
                children: {},
                parentBranch: 'internet.backstage'
              }
            }
          },
          web: {
            count: 2,
            name: 'Web',
            value: 'web',
            parentBranch: 'internet',
            children: {
              html5: {
                count: 2,
                name: 'HTML5',
                value: 'html5',
                children: {},
                parentBranch: 'internet.web'
              }
            }
          }
        }
      }
    };
    const activeFilters = {
      web: {
        count: 2,
        name: 'Web',
        value: 'web',
        parentBranch: 'internet',
        children: {
          html5: {
            count: 2,
            name: 'HTML5',
            value: 'html5',
            children: {},
            parentBranch: 'internet.web'
          }
        }
      },
      python: {
        count: 2,
        name: 'Python',
        value: 'python',
        children: {},
        parentBranch: 'internet.backstage'
      }
    };

    const expected = {
      internet: {
        count: 8,
        name: 'Internet',
        value: 'internet',
        parentBranch: '',
        isActive: false,
        children: {
          backstage: {
            count: 4,
            name: 'Backstage',
            value: 'backstage',
            parentBranch: 'internet',
            isActive: false,
            children: {
              java: {
                count: 1,
                name: 'Java Engineer',
                value: 'java',
                children: {},
                isActive: false,
                parentBranch: 'internet.backstage'
              },
              php: {
                count: 1,
                name: 'PHP',
                value: 'php',
                children: {},
                isActive: false,
                parentBranch: 'internet.backstage'
              },
              python: {
                count: 2,
                name: 'Python',
                value: 'python',
                children: {},
                parentBranch: 'internet.backstage',
                isActive: true
              }
            }
          },
          web: {
            count: 2,
            name: 'Web',
            value: 'web',
            parentBranch: 'internet',
            isActive: true,
            children: {
              html5: {
                count: 2,
                name: 'HTML5',
                value: 'html5',
                children: {},
                isActive: false,
                parentBranch: 'internet.web'
              }
            }
          }
        }
      }
    };

    const actual = vm.$filters.getMarkActiveRecursive(allFilters, activeFilters);
    expect(actual).toEqual(expected);
  });
});
