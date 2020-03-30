<template>
<div class="rc-data-table">
  <RcDataTableHead
    :columns="columns"
    :selectable="selectable"
    :sorting="sorting"
    @sorting-update="$emit('sorting-update', $event)"
  />
  <slot name="rows" />
  <RcDataTablePagination
    v-if="pagination"
    :page="pagination.page"
    :length="pagination.length"
    @input="$emit('pagination', $event)"
  />
</div>
</template>

<script>
import RcDataTableHead from './RcDataTableHead.vue';
import RcDataTablePagination from './RcDataTablePagination.vue';

export default {
  name: 'RcDataTable',
  components: { RcDataTableHead, RcDataTablePagination },
  props: {
    selectable: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      required: true,
    },
    rows: Array,
    pagination: Object,
    sorting: String,
  },
};
</script>
