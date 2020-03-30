<template>
  <v-dialog
    v-model="dialog"
    width="720"
    @click:outside="cancel()"
    @keydown.esc="cancel()"
  >
    <CloseDialogButton @dismiss="cancel()"/>
    <div class="dialog">
      <div class="content pt-12">
        <h2 class="rc-heading-2">Update OBL Screenshot</h2>
        <RcFileUpload @file-update="onFileUpdate($event)" />
        <div class="d-flex justify-center mt-12">
          <button class="rc grey cancel" @click="cancel()">Cancel</button>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { updateOblApi } from '../../../api/pbn/pbn';

import CloseDialogButton from '@/components/dialog/CloseDialogButton.vue';
import RcFileUpload from '@/components/form-controls/RcFileUpload.vue';

export default {
  name: 'UploadOblScreenshotDialog',
  components: { CloseDialogButton, RcFileUpload },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    obl: {
      type: Object,
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
    onFileUpdate(files) {
      if (!files.length) {
        return;
      }
      const payload = {
        id: this.obl.id,
        body: {
          screenshot: files[0],
        },
      };
      updateOblApi(payload)
        .then(() => {
          this.$emit('success');
        })
        .catch((error) => {
          this.$emit('error', error);
        });
    },
    cancel() {
      this.$emit('dismiss');
      this.dialog = false;
      this.file = null;
    },
  },
  created() {
    this.$on('dismiss', () => {
      this.dialog = false;
    });
    this.$on('opened', () => {
      this.file = null;
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/variables';

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
