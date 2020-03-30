<template>
<div class="filters-wrapper pa-6" :ref="clickOutReferenceName">
  <div class="filters-header">
    <div class="activator cursor-pointer" @click="showPopup = true">
      <span class="rc-table-text">Filters</span>
      <v-icon>mdi-chevron-down</v-icon>
    </div>
    <div class="chips ml-2">
      <FilterChips
        :filters="getPbnFiltersState"
        :niches="niches"
      />
    </div>
  </div>
  <div v-if="showPopup" class="filters-popup rc-popup-box">
    <div class="first-row">
      <div class="wide-text-input">
        <rc-checkbox v-model="filtersLocal.url.enabled" />
        <rc-text-field
          label="URL"
          v-model="filtersLocal.url.value"
          name="url"
          placeholder="URL"
          :disabled="!filtersLocal.url.enabled"
          class="tc-text-field"
        />
      </div>
      <RcDropDownField
        title="Niche"
        label="name"
        :options="niches"
        :value="filterLocalNiche[0]"
        @selected="onNicheSelected($event)"
        class="mr-10"
      />
    </div>
    <div class="middle-row mt-10">
      <div class="narrow-text-input">
        <rc-checkbox v-model="filtersLocal.rd.enabled" />
        <rc-text-field
          label="RD"
          v-model="filtersLocal.rd.value"
          name="rd"
          placeholder="RD"
          validate-on-blur
          :disabled="!filtersLocal.rd.enabled"
          class="tc-text-field"
        />
      </div>
      <div class="narrow-text-input">
        <rc-checkbox v-model="filtersLocal.da.enabled" />
        <rc-text-field
          label="DA"
          v-model="filtersLocal.da.value"
          name="da"
          placeholder="DA"
          validate-on-blur
          :disabled="!filtersLocal.da.enabled"
          class="tc-text-field"
        />
      </div>
      <div class="narrow-text-input">
        <rc-checkbox v-model="filtersLocal.pa.enabled" />
        <rc-text-field
          label="PA"
          v-model="filtersLocal.pa.value"
          name="pa"
          placeholder="PA"
          :disabled="!filtersLocal.pa.enabled"
          class="tc-text-field"
        />
      </div>
      <div class="narrow-text-input">
        <rc-checkbox v-model="filtersLocal.tf.enabled" />
        <rc-text-field
          label="TF"
          v-model="filtersLocal.tf.value"
          name="tf"
          placeholder="TF"
          :disabled="!filtersLocal.tf.enabled"
          class="tc-text-field"
        />
      </div>
      <div class="narrow-text-input-100">
        <rc-checkbox v-model="filtersLocal.obl_num.enabled" />
        <rc-text-field
          label="Total OBL"
          v-model="filtersLocal.obl_num.value"
          name="totalObl"
          placeholder="Total OBL"
          :disabled="!filtersLocal.obl_num.enabled"
          class="tc-text-field"
        />
      </div>
    </div>
    <div class="filter-row">
      <div class="wide-text-input">
        <rc-checkbox v-model="filtersLocal.indexing_status.enabled" />
        <v-radio-group
          v-model="filtersLocal.indexing_status.value"
          class="filter-name"
          label="Indexing"
        >
          <v-radio
            v-for="n in indexingOptions"
            :key="n.value"
            :label="n.label"
            :value="n.value"
          />
        </v-radio-group>
      </div>
    </div>
    <button
      class="rc primary mt-4"
      @click="applyFilters()">
      Apply filters
    </button>
  </div>
</div>
</template>

<script>
import {
  mapState, mapMutations, mapActions, mapGetters,
} from 'vuex';
import clickOut from '@/mixins/clickOut';

import RcTextField from '@/components/form-controls/RcTextField.vue';
import RcDropDownField from '@/components/form-controls/RcDropDownField.vue';
import RcCheckbox from '../../../../components/form-controls/RcCheckbox.vue';
import PbnDataTableFiltersStateChips from './PbnDataTableFiltersStateChips.vue';

export default {
  name: 'PbnDataTableFilters',
  mixins: [clickOut],
  components: {
    RcTextField,
    RcDropDownField,
    RcCheckbox,
    FilterChips: PbnDataTableFiltersStateChips,
  },
  computed: {
    ...mapState({
      niches: state => state.inventoryManager.niches,
    }),
    ...mapGetters({
      getPbnFiltersState: 'inventoryManager/getPbnFiltersState',
    }),
  },
  data() {
    return {
      showPopup: false,
      clickOutReferenceName: 'pbnLinksFilters',
      filtersLocal: {
        rd: { value: '', enabled: false },
        da: { value: '', enabled: false },
        pa: { value: '', enabled: false },
        tf: { value: '', enabled: false },
        obl_num: { value: '', enabled: false },
        url: { value: '', enabled: false },
        indexing_status: { value: '', enabled: false },
      },
      filterLocalNiche: [],
      indexingOptions: [
        { value: 'Indexed', label: 'Indexed' },
        { value: 'De-indexed', label: 'De-Indexed' },
      ],
    };
  },
  methods: {
    ...mapMutations({
      setPbnLinksFilteringState: 'inventoryManager/setPbnLinksFilteringState',
      updatePagination: 'inventoryManager/updatePagination',
      updateNicheFilterState: 'inventoryManager/updateNicheFilterState',
      clearNicheFilter: 'inventoryManager/clearNicheFilter',
    }),
    ...mapActions({
      getPbnList: 'inventoryManager/getPbnList',
    }),
    onClickOut() {
      this.showPopup = false;
    },
    onNicheSelected(niche) {
      this.filterLocalNiche.splice(0, 1, niche);
    },
    applyFilters() {
      const filterKeys = Object.keys(this.filtersLocal);
      const queryParams = {};
      filterKeys.forEach((key) => {
        const localFilter = this.filtersLocal[key];
        if (localFilter.enabled && localFilter.value) {
          queryParams[key] = localFilter.value;
        } else {
          queryParams[key] = '';
        }
      });
      queryParams.niche = this.filterLocalNiche.map(niche => niche.id).join(',');
      this.updatePagination(1);
      this.setPbnLinksFilteringState(queryParams);
      this.clearNicheFilter();
      if (this.filterLocalNiche[0]) {
        this.updateNicheFilterState({ event: true, niche: this.filterLocalNiche[0] });
      }
      this.getPbnList()
        .then((query) => {
          this.$router.push({ query }).catch(e => e);
        });
      this.showPopup = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../assets/styles/variables';
@import '../../../../assets/styles/typography';

%checkbox-flex-extend {
  display: flex;
  align-items: flex-start;
  .rc-text-field {
    flex: 1;
    top: 10px;
  }
}
.filters-wrapper {
  position: relative;
}
.activator {
  white-space: nowrap;
  span {
    color: $primary;
  }
}
.filters-header {
  display: flex;
  align-items: center;
}
.filters-popup {
  padding: 30px 24px 45px;
  width: 650px;
  top: 60px;
  &:before {
    top: -6px;
    left: 5%;
  }
}
.wide-text-input {
  max-width: 450px;
  width: 450px;
  @extend %checkbox-flex-extend;
}
.narrow-text-input {
  width: 80px;
  max-width: 80px;
  @extend %checkbox-flex-extend;

}
.narrow-text-input-100 {
  width: 100px;
  max-width: 100px;
  @extend %checkbox-flex-extend;
}
.first-row,
.middle-row {
  display: flex;
  justify-content: space-between;
}
button.rc {
  width: 144px;
  padding: 5px;
  margin: auto;
  display: block;
}
.filter-name {
  margin-top: 2px;
  &::v-deep {
    .v-label {
      color: $mine-shaft;
    }
    .v-input--radio-group__input > .v-label {
      @extend .rc-heading-3-text;
    }
    .v-input--selection-controls__ripple {
      display: none;
    }
  }
}
::v-deep {
  .theme--light.v-icon {
    color: $silver;
  }
  .options-list {
    background: $white;
  }
  .list-container {
    z-index: 1;
  }
  .scroll-container {
    height: 200px;
  }
}
</style>
