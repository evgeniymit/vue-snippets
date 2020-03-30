<template>
<v-dialog
  v-model="showDialog"
  width="450"
  @click:outside="$emit('dismiss')"
>
  <CloseDialogButton @dismiss="$emit('dismiss')"/>
  <div class="content py-2">
    <p class="rc-table-text my-10">{{ message }}</p>
    <p v-if="errorMessage" class="rc-basic-text error-message">{{ errorMessage }}</p>
    <div class="info-icon mb-12" :class="status.concat('-circle')">
      <v-icon color="white" size="32px">{{ iconName }}</v-icon>
    </div>
  </div>
</v-dialog>
</template>

<script>
import CloseDialogButton from './CloseDialogButton.vue';

export default {
  name: 'OperationStatusDialog',
  components: { CloseDialogButton },
  props: {
    status: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  computed: {
    message() {
      switch (this.status) {
        case 'success':
          return 'Operation successful';
        case 'error':
          return 'Error';
        default:
          return '';
      }
    },
    iconName() {
      switch (this.status) {
        case 'success':
          return 'mdi-check';
        case 'error':
          return 'mdi-close';
        default:
          return '';
      }
    },
  },
  data() {
    return {
      showDialog: false,
    };
  },
  watch: {
    show(newValue) {
      if (newValue) {
        this.showDialog = true;
      }
    },
  },
  created() {
    this.$on('dismiss', () => {
      this.showDialog = false;
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables';
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &.success-circle {
    background: $algae-green;
  }
  &.error-circle {
    background: $geraldine;
  }
}
.error-message {
  color: $geraldine;
}
</style>
