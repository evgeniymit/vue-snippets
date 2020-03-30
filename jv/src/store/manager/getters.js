export default {
  pbnLinksState(state) {
    return state.pbnLinks;
  },
  getPbnSortingFieldState: state => (key) => {
    const { ordering } = state.pbnLinksQueryParams;
    const orderingKey = ordering.replace('-', '');
    const orderingDirection = ordering.charAt(0) === '-' ? 'desc' : 'asc';
    return orderingKey === key ? orderingDirection : 'none';
  },
  getPbnFiltersState: state => state.pbnLinksQueryParams,
  getPbnSelectedState: state => pbnId => state.selectedPbn.includes(pbnId),
};
