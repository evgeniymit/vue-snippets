import commonState from 'top20common/distribution/store/state';

export default {
  ...commonState,
  candidates: {
    loading: false,
    next: null,
    error: null,
    candidatesList: null,
    count: null,
    page: 1
  },
  saveSearchLoadingState: {},
  savedSearchesState: {
    errors: null,
    loading: null,
    searches: {}
  },
  searchCandidatesFormState: null
};
