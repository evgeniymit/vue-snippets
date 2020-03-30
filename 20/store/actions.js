import {mapKeys} from 'lodash';
import CandidatesService from 'top20common/distribution/services/candidates';
import commonActions from 'top20common/distribution/store/actions';

import {
  CLEAR_CANDIDATES_PAGE,
  FETCH_CANDIDATES_LIST_FAILURE,
  FETCH_CANDIDATES_LIST_REQUEST,
  FETCH_CANDIDATES_LIST_SUCCESS,
  FIND_CANDIDATES_AND_CHANGE_ROUTE
} from './constants';

export default {
  ...commonActions,
  fetchCandidatesAction(context, params) {
    let {searchParams, loadMore, pageState} = params;
    const options = {...searchParams, page: pageState};
    // Loading phase
    context.commit(FETCH_CANDIDATES_LIST_REQUEST, loadMore);
    return CandidatesService.candidatesList(options)
      .then(response => {
        context.commit(FETCH_CANDIDATES_LIST_SUCCESS, {
          response: response.data,
          loadMore
        });
        if (response.data.results.length !== 0) {
          /* For hopscotch functionality purposes we need to save the first candidate in the localStorage */
          CandidatesService.putInLocalStorage('firstCandidateCode', response.data.results[0].code);
        }
        return response.data.meta.count;
      })
      .catch(error => {
        // Error phase
        context.commit(FETCH_CANDIDATES_LIST_FAILURE, error.response.data.errors);
      });
  },

  fetchSavedSearchesAction(context) {
    context.commit('mutateSavedSearchesState', {loading: true});
    CandidatesService.getSavedSearches({limit: 1000})
      .then(response => {
        const searches = mapKeys(response.data.results, 'filters');
        context.commit('mutateSavedSearchesState', {loading: false, errors: null, searches});
      })
      .catch(error => {
        context.commit('mutateSavedSearchesState', {loading: false, errors: error.response.data.errors});
      });
  },
  saveSearchAction(context, data) {
    context.commit('mutateSaveSearchLoadingState', {filters: data.filters, loading: true});
    return CandidatesService.saveSearch(data)
      .then(response => {
        context.commit('mutateSaveSearchLoadingState', {filters: data.filters, loading: false});
        context.commit('addSavedSearch', response.data);
        return Promise.resolve();
      })
      .catch(errors => {
        context.commit('mutateSaveSearchLoadingState', {filters: data.filters, loading: false});
        return Promise.reject(errors.response.data.errors);
      });
  },
  removeSavedSearchAction(context, savedSearch) {
    context.commit('mutateSaveSearchLoadingState', {filters: savedSearch.filters, loading: true});
    return CandidatesService.deleteSearch(savedSearch.id)
      .then(response => {
        context.commit('mutateSaveSearchLoadingState', {filters: savedSearch.filters, loading: false});
        context.commit('removeSavedSearch', savedSearch.filters);
        return Promise.resolve(response);
      })
      .catch(errors => {
        context.commit('mutateSaveSearchLoadingState', {filters: savedSearch.filters, loading: false});
        return Promise.reject(errors.response.data.errors);
      });
  },
  clearCandidatesPage(context) {
    context.commit(CLEAR_CANDIDATES_PAGE);
  },
  clearFormState(context, formName) {
    context.commit('clearFormState', formName);
  },
  [FIND_CANDIDATES_AND_CHANGE_ROUTE](context, {params, $router}) {
    context.dispatch('fetchFiltersAction', params);
    context.dispatch('fetchCandidatesAction', {
      searchParams: params,
      loadMore: false
    });
    $router.push({path: '/candidates', query: params});
  }
};
