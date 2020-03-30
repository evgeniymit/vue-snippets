<template>
<v-dialog
  v-model="dialog"
  width="720"
  @click:outside="cancel()"
  @keydown.esc="cancel()"
>
  <CloseDialogButton @dismiss="cancel()" />
  <div class="dialog">
    <div class="content">
      <PbnInstanceForm
        ref="pbnForm"
        :submit-action="updatePbn"
        :is-update="true"
        :instance="pbn"
        submit-label="Update"
        @success="onSuccess"
        @dismiss="formCancel()"
      />
    </div>
  </div>
</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import PbnInstanceForm from './PbnInstanceForm.vue';
import CloseDialogButton from '@/components/dialog/CloseDialogButton.vue';

export default {
  name: 'UpdatePbnDialog',
  components: { PbnInstanceForm, CloseDialogButton },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    pbn: Object,
  },
  data() {
    return {
      activeTab: 'manual',
      tabs: {
        manual: 'manual',
        mass: 'mass',
      },
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
    ...mapActions({
      updatePbn: 'inventoryManager/updatePbn',
    }),
    onSuccess() {
      this.$emit('success');
      this.dialog = false;
    },
    onError() {
      this.$emit('error');
      this.dialog = false;
    },
    formCancel() {
      this.$emit('dismiss');
      this.dialog = false;
    },
    cancel() {
      this.$refs.pbnForm.dismiss();
      this.formCancel();
    },
  },
  created() {
    this.$on('dismiss', () => {
      this.dialog = false;
    });
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
  padding: 0 0 86px;
}
.content {
  padding: 0 75px;
}
button {
  width: 176px;
  margin-right: 100px;
}
</style>
