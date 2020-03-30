import {CHANGE_ORDERING_STATE} from '../../store/modules/filters/constants';

export const sorterCandidatesFeature = {};
sorterCandidatesFeature.install = function(Vue, {store}) {
  Vue.prototype.$sorter = (function() {
    let context = null;
    const availableOrdering = ['-published', 'relevance', 'salary', null];
    const sorter = {};

    function getSearchParams() {
      return context.$filters.getFetchFiltersParams();
    }

    function getValidOrder(order, searchParam) {
      order = availableOrdering.indexOf(order) < 0 ? null : order;
      return searchParam ? order || 'relevance' : order === 'relevance' ? null : order;
    }

    sorter.initContext = function(componentContext) {
      context = componentContext;
    };

    sorter.getOrderState = function(sorterName) {
      if (store) {
        let ordering = getSearchParams().ordering || '-published';
        return ordering === sorterName;
      }
    };

    sorter.changeRouteOrdering = function(order = null) {
      let query = {...context.$route.query};
      let newOrder = getValidOrder(order, query.search);
      store.dispatch(CHANGE_ORDERING_STATE, newOrder);
      if (newOrder) {
        query['ordering'] = newOrder;
      } else {
        delete query['ordering'];
      }
      context.$router.push({name: 'candidates', query: query, params: {isTour: true}});
    };

    sorter.sortOrderCandidates = function(order = null) {
      this.changeRouteOrdering(order);
      return context.$store.dispatch('fetchCandidatesAction', {searchParams: getSearchParams(), loadMore: false});
    };

    return sorter;
  })();
};
