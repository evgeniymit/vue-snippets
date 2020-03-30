<template>
<v-dialog v-model="dialog" width="720" @click:outside="$emit('dismiss')">
  <template v-slot:activator="{ on }">
    <button
      class="rc primary"
      :disabled="disableButtons"
      v-on="on"
      @click="onOpened()"
    >
      <span>Export to CSV</span>
    </button>
  </template>
  <CloseDialogButton @dismiss="$emit('dismiss')" />
  <div class="dialog">
    <div class="content">
      <h2 v-if="collection" class="rc-table-text">Export {{ collection.length }} Objects?</h2>
      <ul>
        <li v-for="pbn in collection" :key="pbn.id" class="pbn">
          <RcCheckbox
            :value="getPbnSelectedState(pbn.id)"
            @input="onPbnSelect($event, pbn)"
          />
          <div class="overflow-ellipsis">
            <a :href="pbn.url" :title="pbn.url" @click.prevent>
              {{ pbn.url }}
            </a>
          </div>
          <div class="td rc-basic-text">{{ pbn.niche_name }}</div>
        </li>
      </ul>
      <div class="actions">
        <button class="rc primary save" @click="$emit('export')">Save</button>
        <button class="rc grey cancel ml-2" @click="$emit('dismiss')">Cancel</button>
      </div>
    </div>
  </div>
</v-dialog>
</template>

<script>
import {
  mapMutations,
  mapGetters,
  mapState,
  mapActions,
} from 'vuex';

import CloseDialogButton from '@/components/dialog/CloseDialogButton.vue';
import RcCheckbox from '@/components/form-controls/RcCheckbox.vue';

export default {
  name: 'ExportToFileDialog',
  components: { CloseDialogButton, RcCheckbox },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      collection: [],
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
  computed: {
    ...mapGetters({
      getPbnSelectedState: 'inventoryManager/getPbnSelectedState',
    }),
    ...mapState({
      selectedPbn: state => state.inventoryManager.selectedPbn,
    }),
    disableButtons() {
      return this.selectedPbn ? !this.selectedPbn.length : true;
    },
  },
  methods: {
    ...mapMutations({
      updateSelectedPbnState: 'inventoryManager/updateSelectedPbnState',
    }),
    ...mapActions({
      getPbnListByIdCollection: 'inventoryManager/getPbnListByIdCollection',
    }),
    onPbnSelect(event, pbn) {
      this.updateSelectedPbnState({
        id: pbn.id,
        addToSelection: event,
      });
    },
    onOpened() {
      this.$emit('opened');
      this.getPbnListByIdCollection()
        .then((response) => {
          this.collection = response;
        })
        .catch(e => e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/variables';
ul {
  margin-bottom: 5rem;
  border-bottom: 1px solid $cornflower-blue-15;
}
.pbn {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid $cornflower-blue-15;
  > * {
    &:first-child {
      flex: 2;
    }
    &:nth-child(2) {
      flex: 10;
      max-width: 400px;
    }
    &:last-child {
      flex: 3;
      text-align: center;
    }
  }
}
.content {
  padding: 4rem;
}
.actions {
  display: flex;
  justify-content: center;
}
button {
  width: 176px;
}
h2 {
  margin-bottom: 50px;
}
</style>
