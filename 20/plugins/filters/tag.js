export default function tagFilter(store) {
  let tag = {};
  let tags = null;

  function getTagsForActiveFiltersByMapping(mappingOption, filterItem) {
    const type = Object.keys(filterItem)[0];
    return mappingOption[type];
  }
  tag.getTagsForActiveFilters = function(filterItem) {
    tags = store.getters.allFiltersState.tags;
    const optionsMapping = {
      day: [tags.day],
      week: [tags.week, tags.day],
      month: [tags.week, tags.month, tags.day]
    };
    return getTagsForActiveFiltersByMapping(optionsMapping, filterItem);
  };
  tag.getTagsForDeletingActiveFilters = function(filterItem) {
    tags = store.getters.allFiltersState.tags;
    const optionsMapping = {
      day: [tags.week, tags.day, tags.month],
      week: [tags.month, tags.week],
      month: [tags.month]
    };
    return getTagsForActiveFiltersByMapping(optionsMapping, filterItem);
  };
  return tag;
}
