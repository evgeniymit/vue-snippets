/**
 * This mixin requires a component which will use it to have 'clickOutReferenceName' in its' data
 * and an 'onClickOut' method to handle this event
 */

export default {
  methods: {
    outsideClickListener(event) {
      const element = this.$refs[this.clickOutReferenceName];
      function isVisible(elem) {
        return !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      }
      if (!element.contains(event.target) && isVisible(element)) {
        this.onClickOut(event);
      }
    },
  },
  created() {
    document.addEventListener('mousedown', this.outsideClickListener);
  },
  destroyed() {
    document.removeEventListener('mousedown', this.outsideClickListener);
  },
};
