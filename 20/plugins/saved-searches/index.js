import {identity, isEqual, pickBy, size} from 'lodash';

export const savedSearchesFeature = {};
savedSearchesFeature.install = function(Vue, {store}) {
  Vue.prototype.$savedSearches = (function() {
    const searches = {};

    function savedSearchToDict(search) {
      let searchObject = {};
      let filters = search.split('&');
      for (let filter of filters) {
        let keyValue = filter.split('=');
        searchObject[keyValue[0]] = keyValue[1];
      }
      return searchObject;
    }

    function decodeSavedSearches(searches) {
      return searches.map(search => {
        return decodeURIComponent(search);
      });
    }

    searches.getSaveSearch = function(project) {
      const searches = store.getters.savedSearchesState.searches;
      for (let search in searches) {
        const searchObject = savedSearchToDict(search);
        if (this.isSearchObjectEqualCurrentSearchState(searchObject, project)) {
          return searches[search];
        }
      }
    };

    searches.normalizedSearchParams = function(searchParams) {
      const normalized = {...searchParams};
      if (normalized.salary_min) {
        normalized.salary_min = parseInt(normalized.salary_min);
      }
      if (normalized.salary_max) {
        normalized.salary_max = parseInt(normalized.salary_max);
      }
      return normalized;
    };

    searches.isSearchObjectEqualCurrentSearchState = function(searchObject, project) {
      const searchParams = this.normalizedSearchParams(project);
      if (size(searchParams) !== size(searchObject)) {
        return false;
      }
      for (let key in searchObject) {
        const saved = decodeSavedSearches(searchObject[key].split(',').sort());
        const cur = searchParams[key]
          ? searchParams[key]
              .toString()
              .split(',')
              .sort()
          : null;
        if (!isEqual(cur, saved)) {
          return false;
        }
      }
      for (let key in this.normalizedSearchParams) {
        if (!searchObject.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    };

    searches.toQueryString = function(paramsObject) {
      return Object.keys(paramsObject)
        .map(key => `${key}=${encodeURIComponent(paramsObject[key])}`)
        .join('&');
    };

    searches.save = function(searchParams) {
      const queryString = this.toQueryString(this.normalizedSearchParams(searchParams));
      if (!store.getters.saveSearchLoadingState[queryString] && !this.getSaveSearch(searchParams)) {
        const data = {filters: queryString};
        return new Promise((resolve, reject) => {
          store.dispatch('saveSearchAction', data).then(() => {
            resolve();
          });
        });
      }
    };

    searches.searchParamsFromProject = function(projectData) {
      const searchParams = {
        cities: projectData.city,
        industries: projectData.industry,
        search: projectData.title,
        salary_min: projectData.salary_min,
        salary_max: projectData.salary_max
      };
      return pickBy(searchParams, identity);
    };

    return searches;
  })();
};
