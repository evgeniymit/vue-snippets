import {GET_ACTIVE_FILTERS_STATE, GET_ORDERING_STATE} from './constants';

export default {
  [GET_ACTIVE_FILTERS_STATE]: state => {
    return state.activeFiltersState || {};
  },
  searchState: state => {
    return state.searchState;
  },
  allFiltersState: state => {
    return state.filters.all || {};
  },
  [GET_ORDERING_STATE]: state => {
    return state.orderingState;
  },
  filtersLoadingState: state => {
    return state.filters.loading;
  },
  filtersOptions(state) {
    return state.filters.options || {};
  },
  salaryMinState(state) {
    return state.salaryMinState;
  },
  salaryMaxState(state) {
    return state.salaryMaxState;
  }
};
