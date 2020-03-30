/* eslint no-param-reassign: 0 */
import {forEach, omit} from 'lodash';
import commonMutations from 'top20common/distribution/store/mutations';

import {
  CLEAR_CANDIDATES_PAGE,
  FETCH_CANDIDATES_LIST_FAILURE,
  FETCH_CANDIDATES_LIST_REQUEST,
  FETCH_CANDIDATES_LIST_SUCCESS
} from './constants';

export default {
  ...commonMutations,
  [FETCH_CANDIDATES_LIST_REQUEST](state, loadMore) {
    state.candidates = {
      ...state.candidates,
      loading: true
    };
    if (!loadMore) {
      state.candidates.candidatesList = null;
    }
  },
  [FETCH_CANDIDATES_LIST_SUCCESS](state, payload) {
    let next = payload.response.meta.next;
    let page = state.candidates.page;
    let candidatesList = [].concat(state.candidates.candidatesList);
    if (payload.loadMore) {
      candidatesList = candidatesList.concat(payload.response.results);
      page = payload.response.meta.page;
    } else {
      candidatesList = payload.response.results;
    }
    state.candidates = {
      ...state.candidates,
      loading: false,
      next: next,
      page,
      count: payload.response.meta.count,
      candidatesList: candidatesList
    };
  },

  [FETCH_CANDIDATES_LIST_FAILURE](state, error) {
    state.candidates = {
      ...state.candidates,
      loading: false,
      error
    };
  },

  [CLEAR_CANDIDATES_PAGE](state) {
    state.candidates = {
      ...state.candidates,
      page: 1
    };
  },
  clearFormState(state, formName) {
    const localFormState = {...state[formName]};
    forEach(localFormState, (field, key) => {
      localFormState[key] = null;
    });
    state[formName] = localFormState;
  },
  mutateSaveSearchLoadingState(state, {filters, loading}) {
    state.saveSearchLoadingState = {
      ...state.saveSearchLoadingState,
      [filters]: loading
    };
  },
  mutateSavedSearchesState(state, data) {
    state.savedSearchesState = {...state.savedSearchesState, ...data};
  },
  addSavedSearch(state, search) {
    const searches = {...state.savedSearchesState.searches, [search.filters]: search};
    state.savedSearchesState = {...state.savedSearchesState, searches};
  },
  removeSavedSearch(state, key) {
    const searches = omit(state.savedSearchesState.searches, key);
    state.savedSearchesState = {...state.savedSearchesState, searches};
  },
  changeSearchCandidatesFormState(state, value) {
    state.searchCandidatesFormState = value;
  }
};
