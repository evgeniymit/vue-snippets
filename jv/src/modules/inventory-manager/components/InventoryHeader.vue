<template>
  <div class="wrapper">
    <RcAppHeader :has-right="isHome" :has-left="isHome">
      <template v-if="isHome" v-slot:left>
        <PbnDataTableFilters />
      </template>
      <template v-if="isHome" v-slot:right>
        <PbnDataTableSearch />
        <CreatePbnDialog
          :show="showCreatePbnDialog"
          @opened="showCreatePbnDialog = true"
          @success="onCreatePbnSuccess()"
          @error="onCreatePbnError()"
          @dismiss="showCreatePbnDialog = false"
        />
      </template>
    </RcAppHeader>
    <OperationStatusDialog
      :show="showOperationStatus"
      :status="createPbnStatus"
      @dismiss="showOperationStatus = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import RcAppHeader from '@/components/RcAppHeader.vue';
import CreatePbnDialog from './CreatePbnDialog.vue';
import OperationStatusDialog from
  '@/components/dialog/OperationStatusDialog.vue';
import PbnDataTableFilters from './pbn-data-table/PbnDataTableFilters.vue';
import PbnDataTableSearch from './pbn-data-table/PbnDataTableSearch.vue';

import Route from '@/mixins/route';

export default {
  name: 'InventoryHeader',
  components: {
    RcAppHeader,
    CreatePbnDialog,
    OperationStatusDialog,
    PbnDataTableFilters,
    PbnDataTableSearch,
  },
  mixins: [Route],
  data() {
    return {
      showOperationStatus: false,
      showCreatePbnDialog: false,
      createPbnStatus: '',
    };
  },
  computed: {
    isHome() {
      return this.isRouteActive('inventory-home');
    },
  },
  methods: {
    ...mapActions({
      getPbnList: 'inventoryManager/getPbnList',
    }),
    onCreatePbnSuccess() {
      this.createPbnStatus = 'success';
      this.showOperationStatus = true;
      this.getPbnList();
    },
    onCreatePbnError() {
      this.createPbnStatus = 'error';
      this.showOperationStatus = true;
    },
  },
};
</script>
