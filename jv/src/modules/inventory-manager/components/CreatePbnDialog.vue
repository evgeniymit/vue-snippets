<template>
<v-dialog
  v-model="dialog"
  width="720"
  @click:outside="cancel()"
  @keydown.esc="cancel()"
>
  <template v-slot:activator="{ on }">
    <button class="rc primary" v-on="on" @click="$emit('opened')">Create new record</button>
  </template>
  <CloseDialogButton @dismiss="cancel()" />
  <div class="dialog">
    <header>
      <ul>
        <li
          class="rc-table-text"
          :class="{ active: activeTab === tabs.manual }"
          @click="activeTab = tabs.manual">Create a manual entry</li>
        <li
          class="rc-table-text"
          :class="{ active: activeTab === tabs.mass }"
          @click="activeTab = tabs.mass">Mass upload</li>
      </ul>
    </header>
    <div class="content">
      <PbnInstanceForm
        ref="pbnForm"
        v-if="activeTab === tabs.manual"
        :submit-action="createPbn"
        submit-label="Save"
        @success="onSuccess"
        @dismiss="formCancel()"
      />
      <div v-if="activeTab === tabs.mass">
        <PbnFileUpload
          @upload-success="onSuccess()"
          @upload-error="onError()"
          @dismiss="$emit('dismiss')"
        />
      </div>
    </div>
  </div>
</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import PbnInstanceForm from './PbnInstanceForm.vue';
import CloseDialogButton from '@/components/dialog/CloseDialogButton.vue';
import PbnFileUpload from './PbnFileUpload.vue';

export default {
  name: 'CreatePbnDialog',
  components: { PbnInstanceForm, CloseDialogButton, PbnFileUpload },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
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
      createPbn: 'inventoryManager/createPbn',
    }),
    onSuccess() {
      this.$emit('success');
      this.dialog = false;
    },
    onError() {
      this.$emit('error');
      this.dialog = false;
    },
    cancel() {
      this.$refs.pbnForm.dismiss();
      this.formCancel();
    },
    formCancel() {
      this.$emit('dismiss');
      this.dialog = false;
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
  ul {
    padding: 0;
    display: flex;
    width: 100%;
    li {
      text-align: center;
      line-height: 90px;
      width: 50%;
      position: relative;
      background: $selago;
      cursor: pointer;
      &.active {
        background: $white;
        color: $primary;
      }
      &:after, &:before {
        content: '';
        position: absolute;
      }
      &:before {
        width: $tab-round-size;
        height: $tab-round-size;
      }
      &:after {
        width: $tab-round-size * 2;
        height: $tab-round-size * 2;
        border-radius: 50%;

      }

      &:first-child {
        &:before {
          right: 0;
          bottom: 0;
          background: $white;
        }
        &:after {
          right: 0;
          bottom: 0;
          background: $selago;
        }
        &.active {
          border-top-right-radius: 16px;
          &:before {
            right: -$tab-round-size;
            bottom: 0;
            background: $white;
            z-index: 1;
          }
          &:after {
            right: -$tab-round-size * 2;
            bottom: 0;
            background: $selago;
            z-index: 1;
          }
        }
      }

      &:last-child {
        &:before {
          top: 0;
          left: -$tab-round-size;
          background: $selago;
        }
        &:after {
          top: 0;
          left: -$tab-round-size * 2;
          background: $white;
        }

        &.active {
          &:before {
            bottom: 0;
            left: 0;
            background: $selago;
          }
          &:after {
            bottom: 0;
            left: 0;
            background: $white;
          }
        }
      }
    }
  }
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
