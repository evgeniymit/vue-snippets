<template>
  <div class="rc-pbn-links-summary">
    <div class="data-table">
      <PbnDataTable
        :links="pbnLinksState"
        @pagination-updated="updatePbnList()"
        @sorting="updatePbnList()"
        @delete-pbn="deleteSinglePbn($event)"
        @update-pbn="updatePbn($event)"
        @edit-obls="goToEditObls($event)"
      />
    </div>
    <aside>
      <ExportToFileDialog
        :show="showExportFileDialog"
        @opened="showExportFileDialog = true"
        @export="fileExport()"
        @dismiss="showExportFileDialog = false"
      />
      <UpdatePbnDialog
        :show="showUpdatePbnDialog"
        @success="onPbnUpdated('success')"
        @error="onPbnUpdated('error')"
        :pbn="pbnToBeUpdated"
        @dismiss="showUpdatePbnDialog = false"
      />
      <ConfirmationDialog
        :question="deleteConfirmationQuestion"
        submit-label="Delete"
        :show="showDeletePbnConfirmationDialog"
        @submit="onDeleteSubmit()"
        @dismiss="showDeletePbnConfirmationDialog = false"
      >
        <template v-slot:dialog-activator>
          <button
            class="rc danger"
            :disabled="disableButtons"
            @click="deleteMultiplePbn()"
          >
            <span>Delete</span>
          </button>
        </template>
      </ConfirmationDialog>
    </aside>
    <OperationStatusDialog
      :show="showStatusDialog"
      :status="statusDialogType"
      @dismiss="showStatusDialog = false" />
  </div>
</template>

<script>
import {
  mapState, mapGetters, mapActions, mapMutations,
} from 'vuex';
import PbnDataTable from '../components/PbnDataTable.vue';
import OperationStatusDialog from '@/components/dialog/OperationStatusDialog.vue';
import ExportToFileDialog from '../components/ExportToFileDialog.vue';
import ConfirmationDialog from '@/components/dialog/ConfirmationDialog.vue';
import UpdatePbnDialog from '../components/UpdatePbnDialog.vue';

export default {
  name: 'SummaryView',
  components: {
    PbnDataTable,
    OperationStatusDialog,
    ExportToFileDialog,
    UpdatePbnDialog,
    ConfirmationDialog,
  },
  data() {
    return {
      showExportFileDialog: false,
      showStatusDialog: false,
      showDeletePbnConfirmationDialog: false,
      showUpdatePbnDialog: false,
      deleteMultiple: false,
      statusDialogType: 'error',
      deleteConfirmationQuestion: '',
      deletingPbnId: 0,
      pbnToBeUpdated: {},
    };
  },
  computed: {
    ...mapGetters({
      pbnLinksState: 'inventoryManager/pbnLinksState',
    }),
    ...mapState({
      niches: state => state.inventoryManager.niches,
      selectedPbn: state => state.inventoryManager.selectedPbn,
    }),
    disableButtons() {
      return this.selectedPbn ? !this.selectedPbn.length : true;
    },
  },
  methods: {
    ...mapActions({
      getPbnList: 'inventoryManager/getPbnList',
      exportToFile: 'inventoryManager/exportToFile',
      deletePbnMultiple: 'inventoryManager/deletePbnMultiple',
      deletePbnSingle: 'inventoryManager/deletePbnSingle',
    }),
    ...mapMutations({
      updatePagination: 'inventoryManager/updatePagination',
      setOrdering: 'inventoryManager/setOrdering',
      setPbnLinksFilteringState: 'inventoryManager/setPbnLinksFilteringState',
      clearSelectedPbnState: 'inventoryManager/clearSelectedPbnState',
    }),
    updatePbnList() {
      this.getPbnList()
        .then((query) => {
          this.$router.push({ query }).catch(err => err);
        });
    },
    updatePbn(event) {
      this.showUpdatePbnDialog = true;
      this.pbnToBeUpdated = Object.assign({}, event);
    },
    onPbnUpdated(event) {
      this.statusDialogType = event;
      this.showStatusDialog = true;
      this.showUpdatePbnDialog = false;
    },
    fileExport() {
      this.exportToFile()
        .then(() => {
          this.showExportFileDialog = false;
          this.clearSelectedPbnState();
        })
        .catch(() => {
          this.showExportFileDialog = false;
          this.statusDialogType = 'error';
          this.showStatusDialog = true;
        });
    },
    deleteMultiplePbn() {
      this.deleteMultiple = true;
      this.deleteConfirmationQuestion = `Delete ${this.selectedPbn.length} objects?`;
      this.showDeletePbnConfirmationDialog = true;
    },
    deleteSinglePbn(id) {
      this.deleteMultiple = false;
      this.deleteConfirmationQuestion = 'Delete this object?';
      this.showDeletePbnConfirmationDialog = true;
      this.deletingPbnId = id;
    },
    onDeleteSubmit() {
      this.showDeletePbnConfirmationDialog = false;
      this.showStatusDialog = true;

      if (this.deleteMultiple) {
        this.deletePbnMultiple()
          .then(() => {
            this.statusDialogType = 'success';
          })
          .catch(() => {
            this.statusDialogType = 'error';
          });
        return;
      }
      this.deletePbnSingle(this.deletingPbnId)
        .then(() => {
          this.statusDialogType = 'success';
        })
        .catch(() => {
          this.statusDialogType = 'error';
        });
    },
    goToEditObls(pbnId) {
      if (!pbnId) { return; }
      this.$router.push({ name: 'inventory-pbn-obls', params: { pbnId } });
    },
  },
  created() {
    /**
     * Get query params for a next API call from a router query object
     */
    const queryString = this.$route.query;
    const filterParams = ['url', 'rd', 'pa', 'da', 'tf', 'obl_num', 'niche', 'search'];
    const queryFilters = {};
    filterParams
      .forEach((filterKey) => {
        queryFilters[filterKey] = queryString[filterKey] || '';
      });
    this.updatePagination(+queryString.page || 1);
    this.setOrdering(queryString.ordering || null);
    this.setPbnLinksFilteringState(queryFilters);
    this.updatePbnList();
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/variables';

.rc-pbn-links-summary {
  display: flex;
  width: 100%;
}
.data-table {
  padding-left: 50px;
  width: calc(100% - 260px);
}
aside {
  width: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: calc(100vh - 90px);
  padding: 70px 0 200px;
  border-left: 1px solid $cornflower-blue-15;
}
button {
  width: 176px;
}
</style>
