<template>
<v-dialog
  v-model="dialog"
  width="720"
  @click:outside="cancel()"
  @keydown.esc="cancel()"
>
  <CloseDialogButton @dismiss="cancel()" />
  <div class="dialog">
    <div class="content pt-12">
      <h2 class="rc-heading-2">{{ actionLabel }} OBL</h2>
      <div v-if="obl.id" class="pbn-info">
        <div class="mt-5">
          <span class="rc-heading-3-text">Client:&nbsp;</span>
          <span class="rc-basic-text">{{ obl.client ? obl.client : 'N/A' }}</span>
        </div>
        <div class="mt-5">
          <span class="rc-heading-3-text">Link ID:&nbsp;</span>
          <span class="rc-basic-text">{{ obl.link_id ? obl.link_id : 'N/A' }}</span>
        </div>
      </div>
      <ValidationObserver ref="observer">
        <form @submit.prevent>
          <div class="form-row mt-10">
            <div class="text-input">
              <RcBaseTextInput
                label="Target URL"
                v-model="url"
                name="url"
                rules="required"
                placeholder="Target URL"
                @enter-pressed="submit()"
              />
            </div>
            <div class="text-input mt-6">
              <RcBaseTextInput
                label="Anchor Text"
                v-model="anchorText"
                name="anchorText"
                rules="required"
                placeholder="Anchor Text"
                @enter-pressed="submit()"
              />
            </div>
          </div>
        </form>
      </ValidationObserver>
      <div class="actions mt-12 d-flex justify-space-around">
        <button class="rc primary" @click="submit()">{{ actionLabel }}</button>
        <button class="rc grey cancel" @click="cancel()">Cancel</button>
      </div>
    </div>
  </div>
</v-dialog>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
import { updateOblApi, createOblApi } from '../../../api/pbn/pbn';

import CloseDialogButton from '@/components/dialog/CloseDialogButton.vue';
import RcBaseTextInput from '@/components/base/RcBaseTextInput.vue';

export default {
  name: 'OblDialog',
  components: { CloseDialogButton, RcBaseTextInput, ValidationObserver },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    obl: Object,
    submitAction: Function,
  },
  data() {
    return {
      dialog: false,
      url: '',
      anchorText: '',
    };
  },
  computed: {
    actionLabel() {
      return this.obl.id ? 'Update' : 'Create';
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
    obl() {
      this.url = this.obl.link;
      this.anchorText = this.obl.anchor_text;
    },
  },
  methods: {
    onSuccess() {
      this.$emit('success');
      this.dialog = false;
    },
    onError() {
      this.$emit('error');
      this.dialog = false;
    },
    cancel() {
      this.$emit('dismiss');
      this.dialog = false;
    },
    submit() {
      this.$refs.observer.validate()
        .then((valid) => {
          if (valid) {
            this.save();
          }
        })
        .catch(e => e);
    },
    save() {
      const payload = {
        body: {
          link: this.url,
          anchor_text: this.anchorText,
        },
      };
      if (this.obl.id) {
        payload.id = this.obl.id;
        updateOblApi(payload)
          .then(() => {
            this.onSuccess();
            this.$emit('success');
          })
          .catch((error) => {
            this.$refs.observer.setErrors(error);
          });
        return;
      }
      payload.body.pbn = this.$route.params.pbnId;
      createOblApi(payload.body)
        .then(() => {
          this.onSuccess();
          this.$emit('success');
        })
        .catch((error) => {
          this.$refs.observer.setErrors(error);
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
  width: 150px;
}
</style>
