<template>
<RcDataTable
  :rows="data"
  :columns="oblColumns"
>
  <template v-slot:rows>
    <RcDataTableRow
      v-for="obl in data"
      :key="obl.id"
      @click.native="$emit('edit', obl)"
      class="cursor-pointer"
    >
      <template v-slot:cells>
        <div class="td">
          <RcCheckbox
            :value="obl.selected"
            @input="onOblSelected($event, obl)"
            @click.native.stop
          />
        </div>
        <div class="td rc-basic-text">
          {{ obl.client }}
        </div>
        <div class="td rc-basic-text">
          {{ obl.link_id ? obl.link_id : 'N/A' }}
        </div>
        <div class="td rc-basic-text">
          {{ obl.link ? obl.link : 'N/A' }}
        </div>
        <div class="td rc-basic-text">
          {{ obl.anchor_text ? obl.anchor_text : 'N/A' }}
        </div>
        <div @click.stop="$emit('update-screenshot', obl)" class="td rc-basic-text">
          <img
            v-if="showScreenshot(obl.screenshot)"
            :src="obl.screenshot" alt="screenshot">
          <span v-else>N/A</span>
        </div>
        <div @click.stop class="td">
          <TinyButton
            color="red"
            icon="trash-can-outline"
            @click="$emit('delete', obl.id)"
          />
        </div>
      </template>
    </RcDataTableRow>
  </template>
</RcDataTable>
</template>

<script>
import RcDataTable from '@/components/data-table/RcDataTable.vue';
import RcDataTableRow from '@/components/data-table/RcDataTableRow.vue';
import TinyButton from '@/components/TinyButton.vue';
import RcCheckbox from '@/components/form-controls/RcCheckbox.vue';

export default {
  name: 'OblDataTable',
  components: {
    RcDataTable, RcDataTableRow, TinyButton, RcCheckbox,
  },
  props: {
    data: Array,
  },
  data() {
    return {
      oblColumns: [
        {
          title: ' ',
          key: '',
          sortable: false,
        },
        {
          title: 'Client',
          key: 'client',
          sortable: false,
        },
        {
          title: 'Link ID',
          key: 'link_id',
          sortable: false,
        },
        {
          title: 'Target URL',
          key: 'link',
          sortable: false,
        },
        {
          title: 'Anchor Text',
          key: 'anchor_text',
          sortable: false,
        },
        {
          title: 'Screenshot',
          key: 'screenshot',
          sortable: false,
        },
        {
          title: '',
          key: '',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    showScreenshot(value) {
      return value && value !== 'N/A';
    },
    onOblSelected(event, obl) {
      this.$emit('obl-selection', { event, id: obl.id });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/variables';
@import '../../../assets/styles/typography';

.td {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
img {
  max-height: 50px;
  max-width: 50px;
}
.td,
::v-deep .th {
  &:first-child {
    flex: 0.5;
  }
  &:nth-child(2) {
    flex: 1.5;
  }
  &:nth-child(3) {
    flex: 1;
  }
  &:nth-child(4) {
    flex: 4;
  }
  &:nth-child(5) {
    flex: 3;
  }
}
</style>
