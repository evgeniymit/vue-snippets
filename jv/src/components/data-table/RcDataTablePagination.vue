<template>
  <div class="rc-basic-pagination">
    <v-pagination
      :value="page"
      :length="length"
      :total-visible="9"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'RcDataTablePagination',
  props: {
    page: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/typography';
@import '../../assets/styles/variables';

.rc-basic-pagination {
  /* Pagination item */
  ::v-deep .v-pagination__item {
    box-shadow: none;
    @extend .rc-system-text;
  }
  ::v-deep .theme--light.v-pagination .v-pagination__item {
    background: none;
    min-width: 20px
  }
  ::v-deep .v-pagination__item.v-pagination__item--active.primary {
    background: none !important;
    color: $primary;
  }
  /* Pagination navigation */
  ::v-deep .theme--light.v-pagination .v-pagination__navigation {
    background: $cornflower-blue-15;
    &--disabled {
      background: none;
      .v-icon {
        color: $black;
        opacity: 0.15;
      }
    }
  }
  ::v-deep .v-pagination__navigation {
    box-shadow: none;
    width: 1rem;
    height: 1rem;
    .v-icon {
      font-size: 1rem;
      color: $primary;
    }
  }
}
</style>
