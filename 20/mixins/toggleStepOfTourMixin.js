export default {
  methods: {
    toggleStepOfTour(route, selector, from, to) {
      const tourService = require('top20common/distribution/services/hopscotch-tour');
      tourService.default.finish(false);
      this.$router.push({
        name: route,
        query: this.$filters.getFetchFiltersParams(),
        params: {isTour: true}
      });
      const countId = setInterval(() => {
        if (document.querySelectorAll(selector)[0]) {
          tourService.default.runTour(from, to, 'top20Talent');
          clearInterval(countId);
        }
      }, 300);
    }
  }
};
