import {filtersFeature} from '@/plugins/filters/index';
import Vue from '@/common/test-helpers/mock-vue';
import Vuex from 'vuex';
import getters from '@/store/getters';
import sinon from 'sinon';


describe('filtersFeature', () => {
  let template, vm, store;
  let isFeatureOnStub = sinon.stub()

  store = new Vuex.Store({
    state: {
      userState: {
        details: {
          currency: 'CNY'
        }
      },
      featureSwitchesState: {}
    },
    getters: {
      ...getters,
      isFeatureOn: () => {return isFeatureOnStub}
    }
  });
  template = `<div id="app"></div>`;
  vm = new Vue({template, store}).$mount();
  Vue.use(filtersFeature, {store});

  afterEach(() => {
    isFeatureOnStub.reset()
  });

  describe('getAvailableFilters', () => {
    it('should be equal', () => {
      isFeatureOnStub.returns(true);
      let expectedData = [
        {
          type: 'cities',
          label: 'LOCATION',
          trackingLabel: "Location",
          widget: "list",
        },
        {
          type: 'salaries',
          label: 'SALARY',
          subLabel: 'CNY',
          trackingLabel: 'Salary',
          alwaysShow: true,
          widget: "salaryRange",
        },
        {
          type: 'industries',
          label: 'INDUSTRY',
          trackingLabel: 'Industry',
          widget: "list",
        },
        {
          type: 'job_titles',
          dependency: 'industries',
          label: Vue.prototype.$gettext('JOB TITLE'),
          emptyText: Vue.prototype.$gettext('No options for selected Industry'),
          inactiveText: Vue.prototype.$gettext('Select an Industry first'),
          trackingLabel: 'Job',
          widget: "list",
        },
        {
          type: 'tags',
          label: 'TAGS',
          showAllItems: true,
          showCountPlus: false,
          trackingLabel: 'Tag',
          widget: "list",
        },
        {
          type: 'position_functions',
          dependency: 'industries',
          showAllItems: true,
          label: Vue.prototype.$gettext('AREA OF EXPERTISE'),
          emptyText: Vue.prototype.$gettext('No options for selected Industry'),
          inactiveText: Vue.prototype.$gettext('Select an Industry first'),
          trackingLabel: 'Area of Experience',
          widget: "tree",
        }
      ];

      let availableFilters = vm.$filters.getAvailableFilters();
      expect(availableFilters).toEqual(expectedData);
    });
  });
});
