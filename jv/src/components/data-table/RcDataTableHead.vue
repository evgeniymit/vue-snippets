<template>
<div class="head py-10">
  <div v-if="selectable" class="th">
    <RcCheckbox
      :value="false"
      @input="$emit('update-page-selection', $event)"
    />
  </div>
  <div
    v-for="header in columns"
    :key="header.title"
    class="th rc-table-text"
  >
    <span>{{ header.title }}</span>
    <RcDataTableColumnSorting
      v-if="header.sortable"
      :ordering="getSortingState(header.key)"
      v-on:sort-type="onSortingUpdate($event, header.key)"
    />
  </div>
</div>
</template>

<script>
import RcCheckbox from '../form-controls/RcCheckbox.vue';
import RcDataTableColumnSorting from './RcDataTableColumnSorting.vue';

export default {
  name: 'RcDataTableHead',
  components: { RcCheckbox, RcDataTableColumnSorting },
  props: ['columns', 'selectable', 'sorting'],
  methods: {
    onSortingUpdate(e, key) {
      this.$emit('sorting-update', { event: e, key });
    },
    getSortingState(key) {
      const orderingKey = this.sorting ? this.sorting.replace('-', '') : 'none';
      let orderingDirection = '';
      if (this.sorting) {
        orderingDirection = this.sorting.charAt(0) === '-' ? 'desc' : 'asc';
      }
      return orderingKey === key ? orderingDirection : 'none';
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.th {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex: 1;
}
</style>
