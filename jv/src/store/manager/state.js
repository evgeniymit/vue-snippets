const localStoragePbn = localStorage.getItem('selectedPbn');
export default {
  niches: [],
  pbnLinks: [],
  pbnLinksPagination: {
    page: 1,
    pagesCount: 1,
  },
  pbnLinksQueryParams: {
    ordering: '',
    rd: '',
    da: '',
    pa: '',
    tf: '',
    search: '',
    url: '',
    niche: '',
    indexing_status: undefined,
  },
  selectedPbn: localStoragePbn ? localStoragePbn.split(',').map(id => +id) : [],
};
