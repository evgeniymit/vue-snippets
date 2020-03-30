<template>
<ValidationObserver ref="observer">
  <form @submit.prevent>
    <div class="first-row mt-10">
      <div class="wide-text-input">
        <RcBaseTextInput
          label="*URL"
          v-model="url"
          name="url"
          rules="required"
          placeholder="URL"
        />
      </div>
    </div>
    <div class="middle-row mt-10">
      <div class="narrow-text-input">
        <RcBaseTextInput
          label="RD"
          v-model="rd"
          name="rd"
          rules="required|numeric"
          placeholder="RD"
        />
      </div>
      <div class="narrow-text-input">
        <RcBaseTextInput
          label="DA"
          v-model="da"
          name="da"
          rules="required|numeric"
          placeholder="DA"
        />
      </div>
      <div class="narrow-text-input">
        <RcBaseTextInput
          label="PA"
          v-model="pa"
          name="pa"
          rules="required|numeric"
          placeholder="PA"
        />
      </div>
      <div class="narrow-text-input">
        <RcBaseTextInput
          label="TF"
          v-model="tf"
          name="tf"
          rules="required|numeric"
          placeholder="TF"
        />
      </div>
    </div>
    <div class="select-field mt-3">
      <RcSelectFormControl
        v-model="nicheId"
        :options="niches"
        title="*Niche"
        option-key="name"
        name="niche"
        rules="required"
      />
    </div>
    <div class="first-row mt-10">
      <div class="wide-text-input">
        <RcBaseTextInput
          label="*Credentials"
          v-model="logins"
          name="logins"
          rules="required"
          placeholder="Space separated login/password pairs"
        />
      </div>
    </div>
    <div class="first-row mt-8">
      <div class="wide-text-input">
        <RcBaseTextInput
          label="Login URL"
          v-model="loginUrl"
          name="login_url"
          placeholder="Leave it blank to generate automatically"
        />
      </div>
    </div>
    <NonFieldErrors />
    <div class="actions">
      <button class="rc primary save" @click="submit()">{{ submitLabel }}</button>
      <button class="rc grey cancel ml-2" @click="dismiss()">Cancel</button>
    </div>
  </form>
</ValidationObserver>
</template>

<script>
import { mapState } from 'vuex';
import { ValidationObserver, extend } from 'vee-validate';
import { required, numeric } from 'vee-validate/dist/rules';

import RcBaseTextInput from '@/components/base/RcBaseTextInput.vue';
import RcSelectFormControl from '@/components/form-controls/RcSelectFormControl.vue';

import NonFieldErrors from '@/components/form-controls/NonFieldErrors.vue';

extend('required', { ...required, message: 'This field is required' });
extend('numeric', { ...numeric, message: 'Numeric value required' });

export default {
  name: 'PbnInstanceForm',
  components: {
    RcBaseTextInput,
    RcSelectFormControl,
    NonFieldErrors,
    ValidationObserver,
  },
  props: {
    submitLabel: {
      type: String,
      default: 'Save',
    },
    submitAction: Function,
    isUpdate: {
      type: Boolean,
      default: false,
    },
    instance: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {
      isFormValid: true,
      url: '',
      nicheId: null,
      rd: '',
      da: '',
      pa: '',
      tf: '',
      logins: '',
      loginUrl: '',
    };
  },
  computed: {
    requestFormData() {
      return {
        url: this.url,
        rd: this.rd,
        da: this.da,
        pa: this.pa,
        tf: this.tf,
        nicheId: this.nicheId ? this.nicheId : null,
        logins: this.logins,
        loginUrl: this.loginUrl,
      };
    },
    ...mapState({
      niches: state => state.inventoryManager.niches,
    }),
  },
  watch: {
    instance() {
      this.fillForm();
    },
  },
  methods: {
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
      this.submitAction(this.isUpdate ? this.getInstanceOutOfForm() : this.requestFormData)
        .then(() => {
          this.$emit('success');
          this.$refs.observer.reset();
        })
        .catch((error) => {
          this.$refs.observer.setErrors(error);
        });
    },
    dismiss() {
      this.$refs.observer.reset();
      this.resetForm();
      this.$emit('dismiss');
    },
    fillForm() {
      if (!this.instance) {
        return;
      }
      const { instance } = this;
      this.url = instance.url ? instance.url : '';
      this.nicheId = instance.niche && instance.niche.id ? instance.niche.id : null;
      this.rd = instance.rd && instance.rd.value ? instance.rd.value : '';
      this.da = instance.da && instance.da.value ? instance.da.value : '';
      this.pa = instance.pa && instance.pa.value ? instance.pa.value : '';
      this.tf = instance.tf && instance.tf.value ? instance.tf.value : '';
      this.logins = instance.logins ? instance.logins : '';
      this.loginUrl = instance.login_url ? instance.login_url : '';
    },
    getInstanceOutOfForm() {
      const pbn = Object.assign({}, this.instance);
      pbn.url = this.url;
      pbn.niche = this.nicheId;
      pbn.rd.value = this.rd;
      pbn.da.value = this.da;
      pbn.pa.value = this.pa;
      pbn.tf.value = this.tf;
      pbn.logins = this.logins;
      pbn.login_url = this.loginUrl;

      return pbn;
    },
    resetForm() {
      this.url = '';
      this.nicheId = null;
      this.rd = '';
      this.da = '';
      this.pa = '';
      this.tf = '';
      this.logins = '';
      this.loginUrl = '';
    },
  },
  mounted() {
    this.fillForm();
  },
};
</script>

<style lang="scss" scoped>
.wide-text-input {
  max-width: 400px;
  width: 400px;
}
.narrow-text-input {
  width: 80px;
  max-width: 80px;
}
.narrow-text-input-100 {
  width: 100px;
  max-width: 100px;
}
.middle-row {
  display: flex;
  justify-content: space-between;
}
.actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  button {
    padding: 5px 10px;
    width: 120px;
  }
}
.save {
  width: 144px;
}
.cancel {
  width: 95px;
}
.select-field {
  width: 250px;
}
</style>
