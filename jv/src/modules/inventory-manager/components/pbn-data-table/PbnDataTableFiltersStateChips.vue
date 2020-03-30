<template>
  <div class="chips">
    <div
      v-for="(item, index) in chips"
      :key="index"
      class="filter-item"
    >
      <a
        href="#"
        :title="item.value"
        @click.prevent.stop
        class="rc-system-text overflow-ellipsis"
      >
        {{ item.value }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PbnDataTableFiltersStateChips',
  props: {
    filters: {
      type: Object,
      required: true,
    },
    niches: {
      type: Array,
      required: true,
    },
  },
  computed: {
    chips() {
      const chips = [];
      const nicheIds = this.filters.niche.split(',');
      Object.keys(this.filters).forEach((key) => {
        switch (key) {
          case 'niche':
            nicheIds.forEach((id) => {
              if (!id || !this.niches.length) {
                return;
              }
              const nicheModel = this.niches.find(niche => niche.id === +id);
              chips.push({ key, value: nicheModel.name });
            });
            break;
          case 'url':
          case 'rd':
          case 'da':
          case 'pa':
          case 'tf':
            if (this.filters[key]) {
              chips.push({
                key,
                value: `${key.toUpperCase()}: ${this.filters[key]}`,
              });
            }
            break;
          case 'obl_num':
            if (this.filters[key]) {
              chips.push({
                key,
                value: `Total OBL: ${this.filters[key]}`,
              });
            }
            break;
          case 'indexing_status':
            if (this.filters[key]) {
              chips.push({
                key,
                value: `${this.filters[key]}`,
              });
            }
            break;
          default:
            return null;
        }
        return null;
      });
      return chips;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../assets/styles/variables';

.chips {
  display: flex;
}
.filter-item {
  background: $cornflower-blue-15;
  border-radius: 0.5rem;
  max-width: 140px;
  padding: 0 10px;
  max-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  + .filter-item {
    margin-left: 6px;
  }
  span {
    color: $primary;
  }
}
</style>
