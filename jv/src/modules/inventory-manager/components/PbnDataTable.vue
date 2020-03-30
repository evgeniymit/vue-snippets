<template>
  <div class="wrapper">
    <div class="heading py-10">
      <div class="th">
        <RcCheckbox :value="allSelected" @input="onSelectAllLinks($event)" />
      </div>
      <div
        v-for="header in headers"
        :key="header.text"
        class="th rc-table-text"
      >
        <span>{{ header.text }}</span>
        <PbnDataTableSorting
          v-if="header.sortable"
          :ordering="getPbnSortingFieldState(header.key)"
          v-on:sort-type="onSortTypeChanged($event, header.key)"
        />
      </div>
    </div>
    <div class="tbody">
      <div v-for="link in links" :key="link.id" class="tr py-4">
        <div class="td">
          <RcCheckbox :value="getPbnSelectedState(link.id)" @input="onPbnSelect($event, link)" />
        </div>
        <div class="td"
             @click.stop="toggleInlineEdit($event, link, 'url')">
          <a :href="link.url" :title="link.url" @click.prevent>
            {{ link.url }}
          </a>
        </div>
        <div
          class="td rc-basic-text cursor-pointer text-center break-all"
          @click.stop="toggleInlineEdit($event, link, 'niche', 'select')"
        >{{ link.niche.name }}</div>
        <div
          class="td rc-basic-text cursor-pointer"
          @click.stop="toggleInlineEdit($event, link, 'rd')"
        >{{ link.rd.value }}</div>
        <div
          class="td rc-basic-text cursor-pointer"
          @click.stop="toggleInlineEdit($event, link, 'da')"
        >{{ link.da.value }}</div>
        <div
          class="td rc-basic-text cursor-pointer"
          @click.stop="toggleInlineEdit($event, link, 'pa')"
        >{{ link.pa.value }}</div>
        <div
          class="td rc-basic-text cursor-pointer"
          @click.stop="toggleInlineEdit($event, link, 'tf')"
        >{{ link.tf.value }}</div>
        <div class="td rc-basic-text row-extras" >
          <span @click.stop>{{ link.obl_num }}</span>
          <div class="extras pt-2 pr-1 pb-1">
            <div class="row-actions">
              <TinyButton
                color="blue"
                icon="pencil-outline"
                @click="$emit('update-pbn', link)"
                class="mr-2"
              />
              <TinyButton
                color="blue"
                icon="link"
                @click="$emit('edit-obls', link.id)"
                class="mr-2"
              />
              <TinyButton
                color="red"
                icon="trash-can-outline"
                @click="$emit('delete-pbn', link.id)"
              />
            </div>
            <span
              v-if="link.is_edited"
              class="edited-on rc-system-text">
              Edited {{ formatDate(link.updated_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <BasicPagination
      :page="pbnLinksPagination.page"
      :length="pbnLinksPagination.pagesCount || 1"
      @input="onPageChange($event)"
    />
    <InlineEditPopup
      v-if="showInlineEditPopup"
      :label="activeEditFieldName"
      :show="showInlineEditPopup"
      :value-type="inlineEditValueType"
      :position="inlineEditPopupPosition"
      :options="niches"
      @update="onInlineEditUpdate($event)"
      @dismiss="onInlineEditDismiss"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

import RcCheckbox from '@/components/form-controls/RcCheckbox.vue';
import TinyButton from '@/components/TinyButton.vue';
import BasicPagination from '@/components/BasicPagination.vue';
import PbnDataTableSorting from './pbn-data-table/PbnDataTableSorting.vue';
import InlineEditPopup from './pbn-data-table/PbnDataTableInlineEditPopup.vue';

import DateFormat from '@/mixins/DateFormat';

export default {
  name: 'PbnDataTable',
  components: {
    RcCheckbox,
    TinyButton,
    BasicPagination,
    PbnDataTableSorting,
    InlineEditPopup,
  },
  mixins: [DateFormat],
  props: {
    links: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: [],
      headers: [
        { key: 'url', text: 'URL', sortable: false },
        { key: 'niche', text: 'Niche', sortable: false },
        { key: 'rd', text: 'RD', sortable: true },
        { key: 'da', text: 'DA', sortable: true },
        { key: 'pa', text: 'PA', sortable: true },
        { key: 'tf', text: 'TF', sortable: true },
        { key: 'obl_num', text: 'Total OBL', sortable: true },
      ],
      activeEditFieldName: '',
      activeEditKey: '',
      activeEditPbn: {},
      showInlineEditPopup: false,
      inlineEditPopupPosition: { x: 0, y: 0 },
      inlineEditValueType: 'text',
    };
  },
  computed: {
    ...mapState({
      pbnLinksPagination: state => state.inventoryManager.pbnLinksPagination,
      niches: state => state.inventoryManager.niches,
      selectedPbn: state => state.inventoryManager.selectedPbn,
    }),
    ...mapGetters({
      getPbnSelectedState: 'inventoryManager/getPbnSelectedState',
    }),
    allSelected() {
      let all = true;
      this.links.forEach((link) => {
        const index = this.selectedPbn.findIndex(selected => selected === link.id);
        if (index === -1) {
          all = false;
        }
      });
      return all;
    },
  },
  methods: {
    ...mapMutations({
      updatePagination: 'inventoryManager/updatePagination',
      updateSorting: 'inventoryManager/updateSorting',
      updateSelectedPbnState: 'inventoryManager/updateSelectedPbnState',
    }),
    ...mapActions({
      updatePbn: 'inventoryManager/updatePbn',
    }),
    onPageChange(event) {
      if (!event) {
        return;
      }
      this.updatePagination(event);
      this.$emit('pagination-updated', event);
    },
    onSortTypeChanged(sortType, key) {
      if (!sortType || !key) {
        return;
      }
      this.updateSorting({ sortType, key });
      this.$emit('sorting');
    },
    getPbnSortingFieldState(key) {
      return this.$store.getters['inventoryManager/getPbnSortingFieldState'](key);
    },
    toggleInlineEdit(event, link, key) {
      this.showInlineEditPopup = !this.showInlineEditPopup;
      if (this.showInlineEditPopup) {
        this.activeEditPbn = link;
        this.activeEditFieldName = key === 'obl_num' ? 'Total OBL' : key.toUpperCase();
        this.inlineEditPopupPosition = { x: event.pageX, y: event.pageY };
        this.inlineEditValueType = key === 'niche' ? 'select' : 'text';
        this.activeEditKey = key;
      }
    },
    onInlineEditDismiss() {
      if (this.showInlineEditPopup) {
        this.showInlineEditPopup = false;
      }
    },
    onInlineEditUpdate(newValue) {
      const newPbnData = Object.assign({}, this.activeEditPbn);
      newPbnData[this.activeEditKey] = newValue;
      if (typeof newPbnData.niche !== 'number') {
        newPbnData.niche = this.activeEditPbn.niche.id;
      }
      this.updatePbn(newPbnData).catch(error => error);
      this.showInlineEditPopup = false;
    },
    onPbnSelect(event, pbn) {
      this.updateSelectedPbnState({
        id: pbn.id,
        addToSelection: event,
      });
    },
    onSelectAllLinks(event) {
      this.links.forEach((pbn) => {
        const isSelected = this.getPbnSelectedState(pbn.id);
        if (event ? !isSelected : isSelected) {
          this.onPbnSelect(event, pbn);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/variables';
@import '../../../assets/styles/helpers';

.heading,
.tr {
  display: flex;
  width: 100%;
}

.th, .td {
  display: flex;
  align-items: center;
  justify-content: center;
  &:first-child {
    width: 3%;
  }
  &:nth-child(2) {
    width: 25%;
    justify-content: flex-start;
  }
  &:nth-child(3) {
    width: 16%;
  }
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6),
  &:nth-child(7) {
    width: 10%;
  }
  &:last-child {
    width: 16%;
    padding-right: 60px;
  }
}

.td a {
  color: $primary;
  font-weight: bold;
  @extend .overflow-ellipsis;
}

.tr {
  border-top: 1px solid $cornflower-blue-15;
  &:hover {
    background: $selago;
    .row-actions {
      display: flex;
    }
    .extras {
      justify-content: space-between;
    }
  }
}

.row-extras {
  position: relative;
}
.extras {
  position: absolute;
  top: -16px;
  right: 0;
  height: calc(100% + 32px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.row-actions {
  display: none;
}
.edited-on {
  color: $silver;
  align-self: flex-end;
}
.break-all {
  word-break: break-all;
}
</style>
