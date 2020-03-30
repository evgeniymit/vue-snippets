import {forEach, isEmpty, mapKeys, omit, orderBy} from 'lodash';

import {
  ADD_TO_ACTIVE_FILTERS_MUTATION,
  CHANGE_ORDERING_STATE_MUTATION,
  CHANGE_SEARCH_STATE_MUTATION,
  CLEAR_ACTIVE_FILTERS_MUTATION,
  FETCH_FILTERS_FAILURE,
  FETCH_FILTERS_REQUEST,
  FETCH_FILTERS_SUCCESS,
  REMOVE_FROM_ACTIVE_FILTERS_MUTATION,
  UPDATE_ACTIVE_FILTERS_MUTATION
} from './constants';

export default {
  [FETCH_FILTERS_REQUEST](state) {
    state.filters = {
      ...state.filters,
      loading: true
    };
  },
  [FETCH_FILTERS_SUCCESS](state, filters) {
    /* Recursively parse the list of filters and it's children to object, the keys are the values of filter.
      example output:
      {
        position_functions: {
          internet: {
            count: 2, name:"internet", value:"internet"
            children: {
              backstage: { count: 1, name: 'Backstage', value: 'backstage', children: {}, parentBranch: 'internet' },
              mobile: { count: 1, name: 'Mobile', value: 'mobile', children: {parentBranch: 'internet.mobile'}, parentBranch: 'internet' },
          }
        },
        cities: {
          shanghai: { value: 'shanghai', name: 'shanghai', count: 1}
        }
      }
    */
    const filtersObject = {};

    forEach(filters, (filterValues, type) => {
      filtersObject[type] = mapKeys(filterValues, 'value');
      forEach(filterValues, item => {
        if (item.children) {
          item['parentBranch'] = '';
          item['children'] = childrenMapKeys(item);
        }
      });
    });
    state.filters = {
      loading: false,
      error: null,
      all: filtersObject
    };
  },
  markTop5GroupMutation(state, filterType) {
    state.filters.all[filterType] = mapKeys(orderBy(state.filters.all[filterType], 'count', 'desc'), 'value');
    Object.keys(state.filters.all[filterType]).forEach(function(element, index) {
      if (index < 5) {
        state.filters.all[filterType][element].type = 'countOrderGroup';
      } else {
        state.filters.all[filterType][element].type = 'alphabeticalOrderGroup';
      }
    });
  },
  [FETCH_FILTERS_FAILURE](state, error) {
    state.filters = {
      ...state.filters,
      loading: false,
      error
    };
  },
  [CHANGE_SEARCH_STATE_MUTATION](state, value) {
    state.searchState = value;
  },
  [ADD_TO_ACTIVE_FILTERS_MUTATION](state, filters) {
    /* Example: we need to add Shanghai, week and day to active filters:
     {
        city: {
           shanghai: {
              name: 'Shanghai', value: 'shanghai', isActive: true
           }
        },
       tags: {
          day: { ...},
          week: { ...}
       }
     }
   */
    for (const filterName in filters) {
      state.activeFiltersState = {...(state.activeFiltersState || {})};
      state.activeFiltersState[filterName] = {
        ...state.activeFiltersState[filterName],
        ...filters[filterName]
      };
    }
  },
  setActiveFiltersState(state, filters) {
    state.activeFiltersState = filters;
  },
  [UPDATE_ACTIVE_FILTERS_MUTATION](state, updatedFiltersList) {
    const updatedFiltersListLocal = {};
    const activeFiltersListLocal = {...state.activeFiltersState};
    forEach(updatedFiltersList, (category, categoryKey) => {
      updatedFiltersListLocal[categoryKey] = mapKeys(category, 'value');
    });
    if (!isEmpty(activeFiltersListLocal)) {
      forEach(activeFiltersListLocal, (categoryItem, categoryKey) => {
        const filterValuesByCategory = updatedFiltersListLocal[categoryKey];
        forEach(filterValuesByCategory, (value, key) => {
          if (activeFiltersListLocal[categoryKey] && activeFiltersListLocal[categoryKey][key]) {
            activeFiltersListLocal[categoryKey][key] = {...value};
          }
        });
      });
    }
    state.activeFiltersState = {...activeFiltersListLocal};
  },
  [REMOVE_FROM_ACTIVE_FILTERS_MUTATION](state, filters) {
    let newObj = {...state.activeFiltersState};
    for (const filterName in filters) {
      if (filters.hasOwnProperty(filterName) && state.activeFiltersState && state.activeFiltersState[filterName]) {
        newObj[filterName] = omit(state.activeFiltersState[filterName], Object.keys(filters[filterName]));
      }
    }
    state.activeFiltersState = {...newObj};
  },
  [CLEAR_ACTIVE_FILTERS_MUTATION](state) {
    state.activeFiltersState = null;
    state.searchState = null;
    state.orderingState = null;
    state.salaryMinState = null;
    state.salaryMaxState = null;
  },
  [CHANGE_ORDERING_STATE_MUTATION](state, newOrdering) {
    state.orderingState = newOrdering;
  },
  changeOptionsState(state, newOptions) {
    state.filters.options = {...state.filters.options, ...newOptions};
  },
  changeSalaryMinState(state, newValue) {
    state.salaryMinState = newValue;
  },
  changeSalaryMaxState(state, newValue) {
    state.salaryMaxState = newValue;
  }
};

function childrenMapKeys(item, parentBranch) {
  let childrenObject = {};

  forEach(item['children'], child => {
    const childParentBranch = parentBranch ? `${parentBranch}.${item['value']}` : item['value'];

    childrenObject[child.value] = {...child};
    childrenObject[child.value]['children'] = {};
    childrenObject[child.value]['parentBranch'] = childParentBranch;

    if (child['children'].length) {
      childrenObject[child.value]['children'] = childrenMapKeys(child, childParentBranch);
    }
  });
  return childrenObject;
}
