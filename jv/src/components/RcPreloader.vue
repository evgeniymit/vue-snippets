<template>
<div>
  <div v-if="loading" :class="{ small: small }" class="preloader">
    <v-progress-circular :size="70" indeterminate color="primary" />
  </div>
</div>
</template>

<script>
export default {
  name: 'RcPreloader',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
  .preloader {
    width: 100%;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.small {
      height: 150px;
    }
  }
</style>
