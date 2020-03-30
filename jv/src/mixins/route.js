export default {
  methods: {
    isRouteActive(routeName) {
      return this.$route.matched.some(record => record.name === routeName);
    },
  },
};
