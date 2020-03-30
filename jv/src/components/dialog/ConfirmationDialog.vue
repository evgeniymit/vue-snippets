<template>
<v-dialog
  v-model="dialog"
  width="350"
  @click:outside="$emit('dismiss')"
  @keydown.esc="$emit('dismiss')"
>
  <template v-slot:activator="{ on }">
    <slot v-on="on" name="dialog-activator"></slot>
  </template>
  <CloseDialogButton @dismiss="$emit('dismiss')" />
  <div class="dialog">
    <div class="content">
      <h2 class="rc-heading-3-text text-center mb-6">{{ question }}</h2>
      <div class="actions">
        <button
          class="rc primary save"
          @click="$emit('submit')">{{ submitLabel }}</button>
        <button
          class="rc grey cancel ml-2"
          @click="$emit('dismiss')">{{ declineLabel }}</button>
      </div>
    </div>
  </div>
</v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import CloseDialogButton from '@/components/dialog/CloseDialogButton.vue';

export default {
  name: 'ConfirmationDialog',
  components: { CloseDialogButton },
  props: {
    question: {
      type: String,
      default: 'Confirm current operation',
    },
    submitLabel: {
      type: String,
      default: 'OK',
    },
    declineLabel: {
      type: String,
      default: 'Cancel',
    },
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
  computed: {
    ...mapState({
      selectedPbn: state => state.inventoryManager.selectedPbn,
    }),
    disableButtons() {
      return this.selectedPbn ? !this.selectedPbn.length : true;
    },
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
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables';
.actions {
  display: flex;
  justify-content: center;
}
button {
 width: 120px;
  padding: 5px;
}
.dialog {
  padding: 30px 50px;
}
</style>
