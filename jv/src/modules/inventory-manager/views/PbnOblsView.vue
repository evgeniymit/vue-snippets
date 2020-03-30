<template>
  <div class="wrapper pa-8">
    <h2 class="rc-heading-2">PBN: {{ pbnName }}</h2>
    <h3 class="rc-heading-3">Total OBL count: {{ totalOblCount }}</h3>
    <OblDataTable
      v-if="oblCollection && oblCollection.length"
      :data="oblCollection"
      class="table"
      @delete="deleteObl($event)"
      @edit="openOblDialog($event)"
      @update-screenshot="updateScreenshot($event)"
      @obl-selection="onOblSelection($event)"
    />
    <div v-else class="empty-pbn my-12">This PBN has no outbound links</div>
    <div class="actions py-5 px-12 d-flex justify-space-around">
      <button
        class="rc grey"
        @click="getBack()">Back to PBN list</button>
      <button class="rc primary" @click="openOblDialog()">
        New OBL
      </button>
      <button class="rc danger" :disabled="noSelected" @click="deleteMultipleObl()">
        <span>Delete</span>
      </button>
      <UploadOblFileDialog @success="onSuccess()" @error="onMassUploadError($event)" />
    </div>
    <OperationStatusDialog
      :show="showStatus"
      :status="status"
      :error-message="errorMessage"
      @dismiss="onOperationStatusDialogDismiss()"
    />
    <OblDialog
      :show="showOblDialog"
      :obl="activeObl"
      @dismiss="onOblDialogClosed()"
      @success="onOblDialogSuccess()"
    />
    <UploadOblScreenshotDialog
      :show="showScreenshotDialog"
      :obl="activeObl"
      @dismiss="onScreenshotDialogClosed()"
      @success="onScreenshotDialogSuccess()"
      @error="onScreenshotDialogError($event)"
    />
  </div>
</template>

<script>
import {
  getPbnOblListApi,
  getPbnByIdApi,
  deletePbnOblApi,
  deleteOblMultipleApi,
} from '../../../api/pbn/pbn';

import OblDataTable from '../components/OblDataTable.vue';
import UploadOblFileDialog from '../components/UploadOblFileDialog.vue';
import OblDialog from '../components/OblDialog.vue';
import UploadOblScreenshotDialog from '../components/UploadOblScreenshotDialog.vue';
import OperationStatusDialog from '@/components/dialog/OperationStatusDialog.vue';

export default {
  name: 'PbnOblsView',
  components: {
    OblDataTable,
    UploadOblFileDialog,
    OblDialog,
    UploadOblScreenshotDialog,
    OperationStatusDialog,
  },
  data: () => ({
    oblCollection: [],
    pbnName: '',
    totalOblCount: '',
    showStatus: false,
    status: 'success',
    showOblDialog: false,
    showScreenshotDialog: false,
    activeObl: {},
    errorMessage: '',
  }),
  computed: {
    noSelected() {
      const index = this.oblCollection.findIndex(obl => obl.selected);
      return index === -1;
    },
  },
  methods: {
    getBack() {
      this.$router.push({ name: 'inventory-home' });
    },
    refreshView() {
      getPbnOblListApi(this.$route.params.pbnId)
        .then((response) => {
          this.oblCollection = response.map(obl => Object.assign({}, obl, { selected: false }));
        })
        .catch(error => error);
      getPbnByIdApi(this.$route.params.pbnId)
        .then((response) => {
          this.pbnName = response.url;
          this.totalOblCount = response.obl_num;
        })
        .catch(error => error);
    },
    onError() {
      this.status = 'error';
      this.showStatus = true;
    },
    onSuccess() {
      this.status = 'success';
      this.showStatus = true;
      this.refreshView();
    },
    deleteObl(id) {
      deletePbnOblApi(id)
        .then(() => {
          this.onSuccess();
        })
        .catch(() => {
          this.onError();
        });
    },
    deleteMultipleObl() {
      const selection = this.oblCollection
        .filter(obl => obl.selected).map(obl => obl.id).join(',');
      deleteOblMultipleApi({ id: selection })
        .then(() => {
          this.onSuccess();
        })
        .catch(() => {
          this.onError();
        });
    },
    onOblSelection(e) {
      const index = this.oblCollection.findIndex(obl => obl.id === e.id);
      this.oblCollection[index].selected = e.event;
    },
    openOblDialog(obl) {
      this.activeObl = Object.assign({}, obl || { link: '', anchor_text: '' });
      this.showOblDialog = true;
    },
    onOblDialogClosed() {
      this.showOblDialog = false;
      this.activeObl = {};
    },
    onOblDialogSuccess() {
      this.refreshView();
      this.onOblDialogClosed();
    },
    updateScreenshot(obl) {
      this.activeObl = Object.assign({}, obl);
      this.showScreenshotDialog = true;
    },
    onScreenshotDialogClosed() {
      this.showScreenshotDialog = false;
      this.activeObl = {};
    },
    onScreenshotDialogSuccess() {
      this.onScreenshotDialogClosed();
      this.refreshView();
    },
    onScreenshotDialogError(error) {
      this.onScreenshotDialogClosed();
      this.errorMessage = error.join('. ');
      this.onError();
    },
    onOperationStatusDialogDismiss() {
      this.showStatus = false;
      this.errorMessage = '';
    },
    onMassUploadError(error) {
      const errors = Object.keys(error)
        .filter(key => error[key])
        .map(errKey => error[errKey]);
      this.errorMessage = errors.join('. ');
      this.onError();
    },
  },
  created() {
    this.refreshView();
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/variables";

.wrapper {
  height: 100vh;
  padding-bottom: 76px !important;
}
button {
  width: 150px;
}
.empty-pbn {
  color: $silver;
  font-style: italic;
  text-align: center;
  font-size: 2rem;
}
.actions {
  height: 76px;
  width: calc(100vw - 210px);
  position: fixed;
  bottom: 0;
  right: 0;
  background: $gallery;
  button {
    height: 36px;
  }
}
::v-deep .v-dialog__container {
  position: absolute;
}
</style>
