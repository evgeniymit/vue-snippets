<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <RcBaseDateTimePicker
      v-model="innerValue"
      :label="label"
      :error="errors"
      @input="$emit('input', $event)"
    />
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import RcBaseDateTimePicker from '../base/RcBaseDateTimePicker.vue';

export default {
  name: 'RcDateTimeFormControl',
  components: { ValidationProvider, RcBaseDateTimePicker },
  props: {
    name: { type: String, default: '' },
    rules: { type: String, default: '' },
    label: { type: String, default: '' },
    value: { type: String },
  },
  data: () => ({
    innerValue: '',
  }),
  watch: {
    value(nV) {
      this.innerValue = nV;
    },
  },
};
</script>
