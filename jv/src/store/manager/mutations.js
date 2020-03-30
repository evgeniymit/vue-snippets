import config from '@/const/config';

export default {
  saveNiches(state, niches) {
    if (!niches || !niches.length) {
      return;
    }
    const nicheQuery = state.pbnLinksQueryParams.niche.split(',');
    state.niches = niches.map(
      (niche) => {
        const isSelected = nicheQuery.some(id => +id === niche.id);
        return Object.assign({}, niche, { selected: isSelected });
      },
    );
  },
  setPbnLinksCollectionState(state, linksCollection) {
    state.pbnLinks = linksCollection;
  },
  setPbnLinksPaginationState(state, linksResponse) {
    state.pbnLinksPagination = Object.assign(
      state.pbnLinksPagination,
      { pagesCount: Math.ceil(linksResponse.count / config.PAGE_SIZE) },
    );
  },
  updatePagination(state, page) {
    if (!page) {
      return;
    }
    state.pbnLinksPagination.page = page;
  },
  updateSorting(state, payload) {
    const prefix = payload.sortType === 'desc' ? '-' : '';
    state.pbnLinksQueryParams.ordering = `${prefix}${payload.key}`;
  },
  setOrdering(state, ordering) {
    if (ordering) {
      state.pbnLinksQueryParams.ordering = ordering;
    }
  },
  setPbnLinksFilteringState(state, filters) {
    state.pbnLinksQueryParams = Object.assign(
      {},
      state.pbnLinksQueryParams,
      filters,
    );
  },
  clearNicheFilter(state) {
    state.pbnLinksQueryParams.niche = '';
    state.niches = state.niches.map((niche) => {
      const updated = niche;
      updated.selected = false;
      return updated;
    });
  },
  updateNicheFilterState(state, payload) {
    let index = -1;
    try {
      index = state.niches.findIndex(niche => niche.id === payload.niche.id);
    } catch (error) {
      console.log(error);
    }
    if (index === -1) {
      return;
    }
    state.niches[index].selected = payload.event;
    state.pbnLinksQueryParams.niche = state.niches
      .filter(niche => niche.selected)
      .map(niche => niche.id)
      .join(',');
  },
  updateSearchQueryState(state, search) {
    state.pbnLinksQueryParams.search = search;
  },
  updateSelectedPbnState(state, payload) {
    if (payload.addToSelection) {
      state.selectedPbn.push(payload.id);
    } else {
      const index = state.selectedPbn.findIndex(pbn => pbn === payload.id);
      if (index > -1) {
        state.selectedPbn.splice(index, 1);
      }
    }
    localStorage.setItem('selectedPbn', state.selectedPbn.join(','));
  },
  clearSelectedPbnState(state) {
    state.selectedPbn = [];
    localStorage.removeItem('selectedPbn');
  },
};
