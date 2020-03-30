<template>
<v-dialog
  v-model="dialog"
  width="720"
  @click:outside="cancel()"
  @keydown.esc="cancel()"
>
  <template v-slot:activator="{ on }">
    <button class="rc primary" v-on="on" @click="$emit('opened')">
      Mass Upload
    </button>
  </template>
  <CloseDialogButton @dismiss="cancel()" />
  <div class="dialog">
    <div class="content pt-12">
      <h2 class="rc-heading-2">Mass OBL Uploading</h2>
      <RcFileUpload @file-update="onFileUpdate($event)" />
      <div class="actions mt-12">
        <button class="rc grey cancel" @click="cancel()">Cancel</button>
      </div>
    </div>
  </div>
</v-dialog>
</template>

<script>
import { uploadOblFileApi } from '../../../api/pbn/pbn';

import CloseDialogButton from '@/components/dialog/CloseDialogButton.vue';
import RcFileUpload from '@/components/form-controls/RcFileUpload.vue';

export default {
  name: 'UploadOblFileDialog',
  components: { CloseDialogButton, RcFileUpload },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  watch: {
    show(newValue) {
      if (newValue) {
        this.dialog = true;
        return;
      }
      this.dialog = false;
    },
  },
  methods: {
    onSuccess() {
      this.$emit('success');
      this.dialog = false;
    },
    onError(error) {
      this.$emit('error', error);
      this.dialog = false;
    },
    cancel() {
      this.$emit('dismiss');
      this.dialog = false;
    },
    onFileUpdate(files) {
      const payload = {
        pbn: this.$route.params.pbnId,
        file: files[0],
      };
      uploadOblFileApi(payload)
        .then(() => {
          this.onSuccess();
        })
        .catch((error) => {
          this.onError(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/variables';
$tab-round-size: 16px;

header {
  height: 90px;
  border-bottom: 1px solid $cornflower-blue-15;
}
.dialog {
  background: white;
  border-radius: 16px;
  border: 1px solid $cornflower-blue-15;
  padding: 0 0 32px;
}
.content {
  padding: 0 75px;
}
button {
  width: 176px;
  &.cancel {
    margin: auto;
    display: block;
  }
}
</style>
