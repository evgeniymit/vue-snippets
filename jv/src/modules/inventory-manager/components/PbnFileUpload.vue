<template>
<div class="wrapper">
  <RcFileUpload @file-update="onFileUpdate($event)" />
  <div class="actions mt-12">
    <button class="rc grey cancel" @click="cancel()">Cancel</button>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import RcFileUpload from '@/components/form-controls/RcFileUpload.vue';

export default {
  name: 'PbnFileUpload',
  components: { RcFileUpload },
  methods: {
    ...mapActions({
      uploadPbnFile: 'inventoryManager/uploadPbnFile',
    }),
    onFileUpdate(files) {
      if (!files.length) {
        return;
      }
      this.uploadPbnFile(files[0])
        .then(() => {
          this.$emit('upload-success');
        })
        .catch((e) => {
          this.$emit('upload-error', e);
        });
    },
    cancel() {
      this.$emit('dismiss');
    },
  },
};
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  justify-content: center;
  button {
    width: 120px;
    padding: 5px 10px;
  }
}
</style>
