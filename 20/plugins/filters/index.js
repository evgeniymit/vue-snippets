import {forEach, identity, isEmpty, mapKeys, omit, pickBy} from 'lodash';
import filtersService from 'top20common/distribution/services/filters';

import {FIND_CANDIDATES_AND_CHANGE_ROUTE} from '@/store/constants';
import {
  ADD_TO_ACTIVE_FILTERS,
  GET_ACTIVE_FILTERS_STATE,
  GET_ORDERING_STATE,
  REMOVE_FROM_ACTIVE_FILTERS
} from '@/store/modules/filters/constants';

import tagFilter from './tag';

export const filtersFeature = {};
filtersFeature.install = function(Vue, {store}) {
  Vue.prototype.$filters = (function() {
    const filters = {...filtersService};
    const tag = tagFilter(store);

    const listForExcluding = Symbol('listForExcluding');
    filters[listForExcluding] = ['ordering'];

    /* Functions for adding tags start */
    function getUpdatedFilterItemAfterAdd(filterItem) {
      return mapKeys(tag.getTagsForActiveFilters(filterItem), 'value');
    }

    function getUpdatedFilterItemAfterDelete(filterItem) {
      return mapKeys(tag.getTagsForDeletingActiveFilters(filterItem), 'value');
    }

    function getFilterItemGetter(tagType, action) {
      /* Checking tag_type and return base handler or specific handler (for tags, salary and etc...) */
      const typeMap = mapFilterItemGetters[tagType] || {};
      return (
        typeMap[action] ||
        (item => {
          return item;
        })
      );
    }

    /* Functions for adding tags end */

    function addCommonFilter(filterItem, filterType) {
      store.dispatch(ADD_TO_ACTIVE_FILTERS, {[filterType]: filterItem});
    }

    function deleteCommonFilter(filterItem, filterType) {
      store.dispatch(REMOVE_FROM_ACTIVE_FILTERS, {[filterType]: filterItem});
    }

    /* Tag filter start */

    function addTagFilter(filterItem, filterType) {
      const {tag_type} = Object.values(filterItem)[0];
      const handlerForAddingTag = getFilterItemGetter(tag_type, 'add');
      const addedTags = handlerForAddingTag(filterItem);
      store.dispatch(ADD_TO_ACTIVE_FILTERS, {[filterType]: addedTags});
    }

    function deleteTagFilter(filterItem, filterType) {
      const {tag_type} = Object.values(filterItem)[0];
      const handlerForDeletingTag = getFilterItemGetter(tag_type, 'delete');
      const removedTags = handlerForDeletingTag(filterItem);
      store.dispatch(REMOVE_FROM_ACTIVE_FILTERS, {[filterType]: removedTags});
    }

    /* Tag filter end */

    function deleteIndustriesFilter(filterItem, filterType) {
      store.dispatch(REMOVE_FROM_ACTIVE_FILTERS, {[filterType]: filterItem});
      store.dispatch(REMOVE_FROM_ACTIVE_FILTERS, {job_titles: store.getters[GET_ACTIVE_FILTERS_STATE].job_titles});
      store.dispatch(REMOVE_FROM_ACTIVE_FILTERS, {
        position_functions: store.getters[GET_ACTIVE_FILTERS_STATE].position_functions
      });
    }

    /* Salary filter start */

    function addSalaryFilter(filterItem) {
      const intSalaryMin = parseInt(filterItem['salaryMin']);
      const intSalaryMax = parseInt(filterItem['salaryMax']);
      const options = store.getters.filtersOptions;
      if (intSalaryMin) {
        store.commit('changeSalaryMinState', intSalaryMin === options['salaryMin'] ? null : intSalaryMin);
      }
      if (intSalaryMax) {
        store.commit('changeSalaryMaxState', intSalaryMax === options['salaryMax'] ? null : intSalaryMax);
      }
    }

    function deleteSalaryFilter() {
      store.commit('changeSalaryMinState', null);
      store.commit('changeSalaryMaxState', null);
    }

    /* Salary filter end */

    function commonQueryParamsParser(query, filterType, allFilters) {
      let filterItems = {};
      let filterTypeItems = {};
      forEach(query[filterType].split(','), filterValue => {
        if (allFilters.hasOwnProperty(filterType) && allFilters[filterType].hasOwnProperty(filterValue)) {
          filterTypeItems[filterValue] = allFilters[filterType][filterValue];
        }
      });
      if (!isEmpty(filterTypeItems)) {
        filterItems[filterType] = filterTypeItems;
      }
      store.dispatch(ADD_TO_ACTIVE_FILTERS, filterItems);
    }

    function salaryQueryParamsParser(query) {
      addSalaryFilter({salaryMin: query['salary_min'], salaryMax: query['salary_max']});
    }

    function tagsQueryParamsParser(query, filterType, allFilters) {
      const queryParamsTags = query[filterType].split(',');
      for (let tagName of queryParamsTags) {
        let filterItem = allFilters.tags[tagName];
        if (filterItem) {
          addTagFilter({[tagName]: filterItem}, 'tags');
        }
      }
    }

    function getFilterItem(requestedValue, filter) {
      if (filter && filter.value === requestedValue) {
        return filter;
      }
      for (let key in filter.children) {
        let newFilter = getFilterItem(requestedValue, filter.children[key]);
        if (newFilter) {
          return newFilter;
        }
      }
    }

    function treeQueryParamsParser(query, filterType, allFilters) {
      const filters = allFilters[filterType];
      let item;
      if (!filters) {
        return;
      }

      forEach(query[filterType].split(','), filterValue => {
        for (let key in filters) {
          item = getFilterItem(filterValue, filters[key]);
          if (item) {
            addTreeFilter({[filterValue]: item}, filterType);
            break;
          }
        }
      });
    }

    function commonFilterParamsFetcher(filterType, filterItems) {
      return {
        [filterType]: Object.keys(filterItems).join(',')
      };
    }

    function isBranchActive(parent, branch) {
      for (let i = 1; i < branch.length; i++) {
        parent = parent.children[branch[i]];
        if (parent.isActive) {
          return true;
        }
      }
    }

    function getParentFromBranch(branch, allTypeFilters) {
      let parent = allTypeFilters[branch[0]];

      if (parent) {
        for (let i = 1; i < branch.length; i++) {
          parent = parent.children[branch[i]];
        }
      }
      return parent || {};
    }

    function handleNeighborsForParents(filterItem, filterType, allFilters) {
      const item = Object.values(filterItem)[0];
      if (item.isActive) {
        store.dispatch(REMOVE_FROM_ACTIVE_FILTERS, {[filterType]: filterItem});
      } else if (item['parentBranch']) {
        const parentBranch = item['parentBranch'].split('.');
        let parent = allFilters[filterType][parentBranch[0]];
        let isInActiveBranch = parent.isActive || isBranchActive(parent, parentBranch);

        const directParent = getParentFromBranch(parentBranch, allFilters[filterType]);
        forEach(directParent.children, (childItem, childValue) => {
          if (childValue !== item.value && isInActiveBranch) {
            store.dispatch(ADD_TO_ACTIVE_FILTERS, {[filterType]: {[childValue]: childItem}});
          }
        });

        handleNeighborsForParents({[directParent.value]: directParent}, filterType, allFilters);
      }
    }

    function removeChildrenFromActiveFilters(filterType, children) {
      store.dispatch(REMOVE_FROM_ACTIVE_FILTERS, {[filterType]: children});
      forEach(children, child => {
        if (!isEmpty(child['children'])) {
          removeChildrenFromActiveFilters(filterType, child['children']);
        }
      });
    }

    function addTreeFilter(filterItem, filterType) {
      const filterObject = Object.values(filterItem)[0];
      if (!isEmpty(filterObject.children)) {
        removeChildrenFromActiveFilters(filterType, filterObject.children);
      }
      filterObject.isActive = true; // set isActive to true, so have updated data in recursion after page reload.
      store.dispatch(ADD_TO_ACTIVE_FILTERS, {[filterType]: filterItem});

      const branch = filterObject.parentBranch.split('.');
      const allFilters = store.getters.allFiltersState;

      let parent = allFilters[filterType][branch[0]];

      if (parent) {
        for (let i = 1; i < branch.length; i++) {
          parent = parent.children[branch[i]];
        }

        let allChildrenActive = true;
        for (let value in parent.children) {
          if (!parent.children[value].isActive && parent.children[value].count && value !== filterObject.value) {
            allChildrenActive = false;
            break;
          }
        }
        if (allChildrenActive) {
          addTreeFilter({[parent.value]: parent}, filterType);
        }
      }
    }

    function deleteTreeFilter(filterItem, filterType) {
      const active = store.getters[GET_ACTIVE_FILTERS_STATE];
      const isInActiveFilters = Object.keys(active[filterType]).indexOf(Object.keys(filterItem)[0]) >= 0;
      if (isInActiveFilters) {
        store.dispatch(REMOVE_FROM_ACTIVE_FILTERS, {[filterType]: filterItem});
      } else {
        const allFilters = store.getters.allFiltersState;
        handleNeighborsForParents(filterItem, filterType, allFilters);
      }
    }

    function salariesTrackActiveFilterAddParamsGetter() {
      const params = filters.getFetchFiltersParams();
      const salaryMinLabel = params.salary_min ? `from ${params.salary_min / 1000}k ` : '';
      const salaryMaxLabel = params.salary_max ? `to ${params.salary_max / 1000}k` : '';
      return {count: 1, values: salaryMinLabel + salaryMaxLabel};
    }

    function commonTrackActiveFilterAddParamsGetter(type) {
      const activeFiltersState = store.getters[GET_ACTIVE_FILTERS_STATE];
      let names = [];
      forEach(activeFiltersState[type], item => {
        names.push(item.name);
      });
      return {values: names.join(','), count: names.length};
    }

    const mapFilterItemGetters = {
      updated: {
        add: getUpdatedFilterItemAfterAdd,
        delete: getUpdatedFilterItemAfterDelete
      }
    };

    const mapActiveFilterDeleteHandlers = {
      salaries: deleteSalaryFilter,
      tags: deleteTagFilter,
      industries: deleteIndustriesFilter,
      position_functions: deleteTreeFilter
    };

    const mapActiveFilterAddHandlers = {
      salaries: addSalaryFilter,
      tags: addTagFilter,
      position_functions: addTreeFilter
    };

    const mapQueryParamsParsers = {
      salary_min: salaryQueryParamsParser,
      salary_max: salaryQueryParamsParser,
      tags: tagsQueryParamsParser,
      position_functions: treeQueryParamsParser
    };

    const mapTrackActiveFilterAddParamsGetters = {
      salaries: salariesTrackActiveFilterAddParamsGetter
    };
    filters.getSalaryName = function(salaryFrom, salaryTo) {
      return `between ${salaryFrom} and ${salaryTo}`;
    };
    filters.isLoaded = function() {
      return !isEmpty(store.getters.allFiltersState);
    };
    filters.deleteActiveFilter = function(filterItem, type, $router) {
      let handler = mapActiveFilterDeleteHandlers[type] || deleteCommonFilter;
      handler(filterItem, type);
      let params = this.getFetchFiltersParams();
      store.dispatch(FIND_CANDIDATES_AND_CHANGE_ROUTE, {params, $router});
    };
    filters.addActiveFilter = function(filterItem, type, $router) {
      let handler = mapActiveFilterAddHandlers[type] || addCommonFilter;
      handler(filterItem, type);
      let params = this.getFetchFiltersParams();
      store.dispatch(FIND_CANDIDATES_AND_CHANGE_ROUTE, {params, $router});
    };
    filters.getNotActiveFilters = function(filterType) {
      const all = store.getters.allFiltersState;
      const active = store.getters[GET_ACTIVE_FILTERS_STATE];

      if (!isEmpty(all) && !isEmpty(active) && active[filterType]) {
        return omit(all[filterType], Object.keys(active[filterType]));
      }
      return all[filterType];
    };
    filters.hasActiveFilters = function() {
      const searchParams = filters.getFetchFiltersParams();
      for (let key in searchParams) {
        /* 'listForExcluding' defined in this module and we can expand it by new search params */
        if (searchParams[key] && this[listForExcluding].indexOf(key) === -1) {
          return true;
        }
      }
    };
    filters.getAvailableFilters = function() {
      const availableFilters = [
        {
          type: 'cities',
          label: Vue.prototype.$gettext('LOCATION'),
          trackingLabel: 'Location',
          widget: 'list'
        },
        {
          type: 'salaries',
          label: Vue.prototype.$gettext('SALARY'),
          subLabel: store.getters.userDetailsState.currency,
          trackingLabel: 'Salary',
          alwaysShow: true,
          widget: 'salaryRange'
        },
        {
          type: 'industries',
          label: Vue.prototype.$gettext('INDUSTRY'),
          trackingLabel: 'Industry',
          widget: 'list'
        },
        {
          type: 'job_titles',
          dependency: 'industries',
          label: Vue.prototype.$gettext('JOB TITLE'),
          emptyText: Vue.prototype.$gettext('No options for selected Industry'),
          inactiveText: Vue.prototype.$gettext('Select an Industry first'),
          trackingLabel: 'Job',
          widget: 'list'
        },
        {
          type: 'tags',
          label: Vue.prototype.$gettext('TAGS'),
          showCountPlus: false,
          showAllItems: true, // show all values of filter, don't display the `show more` and `show less` buttons
          trackingLabel: 'Tag',
          widget: 'list'
        },
        {
          type: 'position_functions',
          dependency: 'industries',
          showAllItems: true,
          label: Vue.prototype.$gettext('AREA OF EXPERTISE'),
          emptyText: Vue.prototype.$gettext('No options for selected Industry'),
          inactiveText: Vue.prototype.$gettext('Select an Industry first'),
          trackingLabel: 'Area of Experience',
          widget: 'tree'
        }
      ];
      return [...availableFilters];
    };
    filters.changeStateFromQuery = function({search, ordering, ...query}) {
      if (search) {
        store.commit('changeSearchCandidatesFormState', search);
      }
      const intSalaryMin = parseInt(query['salary_min']);
      const intSalaryMax = parseInt(query['salary_max']);

      if (intSalaryMin) {
        query['salary_min'] = intSalaryMax && intSalaryMax < intSalaryMin ? intSalaryMax : intSalaryMin;
      } else {
        delete query['salary_min'];
      }
      if (intSalaryMax) {
        query['salary_max'] = intSalaryMin && intSalaryMin > intSalaryMax ? intSalaryMin : intSalaryMax;
      } else {
        delete query['salary_max'];
      }

      if (!isEmpty(query)) {
        let allFilters = store.getters.allFiltersState;
        for (let filterType in query) {
          let parser = mapQueryParamsParsers[filterType] || commonQueryParamsParser;
          parser(query, filterType, allFilters);
        }
      }
    };
    filters.getFetchFiltersParams = function() {
      const activeFiltersState = store.getters[GET_ACTIVE_FILTERS_STATE];
      const searchState = store.getters.searchState;
      const orderingState = store.getters[GET_ORDERING_STATE];
      const salaryMinState = store.getters.salaryMinState;
      const salaryMaxState = store.getters.salaryMaxState;
      let params = {
        ordering: orderingState,
        search: searchState,
        salary_min: salaryMinState,
        salary_max: salaryMaxState
      };
      forEach(activeFiltersState, (filterItems, filterType) => {
        params = {
          ...params,
          ...commonFilterParamsFetcher(filterType, filterItems)
        };
      });
      return pickBy(params, identity);
    };
    filters.getMarkActiveRecursive = function(allFilters, activeFilters) {
      let marked = {};
      forEach(allFilters, (item, name) => {
        marked[name] = item;
        marked[name].isActive = Boolean(activeFilters && activeFilters[name]);
        if (item.hasOwnProperty('children') && !isEmpty(item['children'])) {
          marked[name]['children'] = filters.getMarkActiveRecursive(item['children'], activeFilters);
        }
      });
      return marked;
    };
    filters.getTrackingParams = function(availableFilter) {
      const getter =
        mapTrackActiveFilterAddParamsGetters[availableFilter.type] || commonTrackActiveFilterAddParamsGetter;
      return {...getter(availableFilter.type), type: availableFilter.trackingLabel};
    };
    return filters;
  })();
};
