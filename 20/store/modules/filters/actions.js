import CandidatesService from 'top20common/distribution/services/candidates';

import {
  ADD_TO_ACTIVE_FILTERS,
  ADD_TO_ACTIVE_FILTERS_MUTATION,
  CHANGE_ORDERING_STATE,
  CHANGE_ORDERING_STATE_MUTATION,
  CHANGE_SEARCH_STATE,
  CHANGE_SEARCH_STATE_MUTATION,
  CLEAR_ACTIVE_FILTERS,
  CLEAR_ACTIVE_FILTERS_MUTATION,
  FETCH_FILTERS_FAILURE,
  FETCH_FILTERS_REQUEST,
  FETCH_FILTERS_SUCCESS,
  REMOVE_FROM_ACTIVE_FILTERS,
  REMOVE_FROM_ACTIVE_FILTERS_MUTATION,
  UPDATE_ACTIVE_FILTERS_MUTATION
} from './constants';

export default {
  fetchFiltersAction(context, params = {}) {
    context.commit(FETCH_FILTERS_REQUEST);
    return new Promise((resolve, reject) => {
      CandidatesService.fetchOptions(params)
        .then(response => {
          let {salary_max, salary_min, salary_range_indexes, ...filters} = response.data;
          context.commit(FETCH_FILTERS_SUCCESS, filters);
          context.commit('markTop5GroupMutation', 'cities');
          context.commit('markTop5GroupMutation', 'industries');
          context.commit(UPDATE_ACTIVE_FILTERS_MUTATION, filters);
          context.commit('changeOptionsState', {
            salaryMin: salary_min,
            salaryMax: salary_max,
            salaryRanges: salary_range_indexes
          });
          resolve(response);
        })
        .catch(error => {
          context.commit(FETCH_FILTERS_FAILURE, error.response.data.errors);
        });
    });
  },
  [CHANGE_SEARCH_STATE](context, value) {
    context.commit(CHANGE_SEARCH_STATE_MUTATION, value);
  },
  [ADD_TO_ACTIVE_FILTERS](context, filters) {
    context.commit(ADD_TO_ACTIVE_FILTERS_MUTATION, filters);
  },
  setActiveFiltersAction(context, filters) {
    context.commit('setActiveFiltersState', filters);
  },
  [REMOVE_FROM_ACTIVE_FILTERS](context, filters) {
    context.commit(REMOVE_FROM_ACTIVE_FILTERS_MUTATION, filters);
  },
  [CLEAR_ACTIVE_FILTERS](context) {
    context.commit(CLEAR_ACTIVE_FILTERS_MUTATION);
  },
  [CHANGE_ORDERING_STATE](context, newOrdering) {
    context.commit(CHANGE_ORDERING_STATE_MUTATION, newOrdering);
  }
};
