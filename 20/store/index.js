import redirectService from 'top20common/distribution/services/redirects';
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import actions from './actions';
import getters from './getters';
import moduleContactedCandidates from './modules/contacted-candidates';
import moduleDetailedCandidates from './modules/detailed-candidates';
import moduleFilters from './modules/filters';
import moduleManage from './modules/manage';
import moduleProjects from './modules/projects';
import moduleSavedCandidates from './modules/saved-candidates';
import moduleUnlockedCandidates from './modules/unlocked-candidates';
import mutations from './mutations';
import state from './state';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: 'store',
  storage: window.localStorage,
  reducer: state => ({
    projectsState: state.projectsState,
    contactedCandidatesState: state.contactedCandidatesState,
    savedCandidatesState: state.savedCandidatesState,
    detailedCandidatesState: state.detailedCandidatesState
  })
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
});

const persistStorageList = [vuexLocalStorage, redirectService.getCommonStorage()];

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    filtersState: moduleFilters,
    unlockedCandidatesState: moduleUnlockedCandidates,
    manageState: moduleManage,
    contactedCandidatesState: moduleContactedCandidates,
    detailedCandidatesState: moduleDetailedCandidates,
    savedCandidatesState: moduleSavedCandidates,
    projectsState: moduleProjects
  },
  plugins: [vuexLocalStorage.plugin, redirectService.getCommonStorage().plugin]
});

if (module.hot) {
  module.hot.accept(['./mutations', './actions', './getters.js'], () => {
    store.hotUpdate({
      mutations: require('./mutations').default,
      actions: require('./actions').default,
      getters: require('./getters').default
    });
  });
}

const clearPersistentStorage = function() {
  for (let storage of persistStorageList) {
    storage.storage.removeItem(storage.key);
  }
};

export default store;
export {clearPersistentStorage};
