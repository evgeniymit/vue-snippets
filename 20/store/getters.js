import {filter, forEach} from 'lodash';
import commonGetters from 'top20common/distribution/store/getters';

import {IS_USER_ACCOUNT_APPROVED} from './constants';

export default {
  ...commonGetters,
  getCandidates: state => {
    return state.candidates.candidatesList;
  },
  getIsNext: state => {
    return state.candidates.next;
  },
  userValidCitiesState: (state, getters) => {
    return getExistingFilterItemsByKeys(getters.allFiltersState.cities, state.userState.details.cities);
  },
  userValidIndustriesState: (state, getters) => {
    return getExistingFilterItemsByKeys(getters.allFiltersState.industries, state.userState.details.industries);
  },
  userCitiesWithCountListState: (state, getters) => {
    let items = getExistingFilterItemsByKeys(getters.allFiltersState.cities, state.userState.details.cities);
    return filter(items, 'count');
  },
  getLoading: state => {
    return state.candidates.loading;
  },
  getPage: state => {
    return state.candidates.page;
  },
  getCandidatesCount: state => {
    return state.candidates.count;
  },
  savedSearchesState: state => {
    return state.savedSearchesState;
  },
  saveSearchLoadingState: state => {
    return state.saveSearchLoadingState;
  },
  [IS_USER_ACCOUNT_APPROVED]: state => {
    return (
      state.userState.details.account_status === 'approved' || state.userState.details.account_status === 'subscribed'
    );
  },
  isAccountVisibility: state => {
    return state.userState.details.visibility === 'account';
  },
  accountUsersNameByIdState: (state, getters) => {
    return {
      ...getters.authorsNameByIdForSaved,
      ...getters.authorsNameByIdForContacted,
      ...getters.authorsNameByIdForProjects
    };
  }
};

function getExistingFilterItemsByKeys(filterItems, keys) {
  let existingFilterItems = {};
  forEach(keys || [], key => {
    if (filterItems && filterItems[key]) {
      existingFilterItems[key] = filterItems[key];
    }
  });
  return existingFilterItems;
}
