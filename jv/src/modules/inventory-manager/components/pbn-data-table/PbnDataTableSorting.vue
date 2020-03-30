<template>
    <div ref="container" class="rc-data-table-sorting-wrapper pa-3">
      <v-tooltip
        v-for="arrow in arrows"
        :key="arrow.sortType"
        :attach="container"
        min-width="145px"
        bottom
      >
        <template v-slot:activator="{ on }">
          <button
            :class="{ active: isActive(arrow.sortType) }"
            v-on="on"
            class="arrow-box"
            @click="$emit('sort-type', arrow.sortType)"
          >
            <v-icon size="16px">mdi-chevron-{{ arrow.icon }}</v-icon>
          </button>
        </template>
        <span class="rc-system-text">
          Sorting in {{ arrow.sortType === 'desc' ? 'descending' : 'ascending'}} order
        </span>
      </v-tooltip>
    </div>
</template>

<script>
export default {
  name: 'SortingArrows',
  props: {
    ordering: {
      type: String,
      default: 'none',
    },
  },
  data() {
    return {
      arrows: [{ icon: 'up', sortType: 'desc' }, { icon: 'down', sortType: 'asc' }],
      container: '',
    };
  },
  methods: {
    isActive(type) {
      return type === this.ordering;
    },
  },
  mounted() {
    this.container = this.$refs.container;
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../assets/styles/variables';

.arrow-box {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  display: flex;
  justify-content: center;
  ::v-deep .v-icon {
    color: $mercury;
  }
  &.active {
    background: $cornflower-blue-15;
    ::v-deep .v-icon {
      color: $primary;
      opacity: 0.5;
    }
  }
}
.rc-data-table-sorting-wrapper {
  ::v-deep .v-tooltip__content {
    background: white;
    color: $black;
    border: 1px solid $gallery;
    padding: 5px;
    &:before {
      content: '';
      position: absolute;
      top: -7px;
      left: calc(50% - 7px);
      width: 0.75rem;
      height: 0.75rem;
      border-top: 1px solid $gallery;
      border-right: 1px solid $gallery;
      transform: rotate(-45deg);
      background: $white;
    }
  }
}
</style>
