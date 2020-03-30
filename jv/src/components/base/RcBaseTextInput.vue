/* eslint-disable max-len */
<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <div class="rc-text-field">
      <v-text-field
        v-model="inputValue"
        :name="name"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :error-messages="errors"
        @input="$emit('input', $event)"
        @keydown="onKeydown($event)"
      >
        <template v-slot:label>
          <span class="rc-heading-3-text">{{ label }}</span>
        </template>
      </v-text-field>
    </div>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'RcBaseTextInput',
  components: { ValidationProvider },
  props: {
    label: {
      type: String,
    },
    value: {
      type: [String, Number],
    },
    rules: String,
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: '',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.inputValue = newVal;
      },

    },
  },
  methods: {
    onKeydown(event) {
      if (event.keyCode === 13) {
        this.$emit('enter-pressed', this.inputValue);
      }
    },
  },
};
</script>

<style lang="scss">
@import '../../assets/styles/variables';

.rc-text-field {
  position: relative;

  label.v-label {
    transform: none;
    left: 0;
    top: -20px;

    span {
      color: $mine-shaft;
      font-size: 16px;
    }
  }
  .v-text-field input {
    font-size: 14px;
    color: $silver;
  }
  .theme--light.v-text-field {
    &:not(.v-input--has-state) > .v-input__control > .v-input__slot:hover:before,
    > .v-input__control > .v-input__slot:before {
      border-color: $hawkes-blue;
    }
    &.v-input--is-disabled > .v-input__control > .v-input__slot:before {
      border-image: none;
    }
  }
  .theme--light.v-input:not(.v-input--is-disabled) input {
    color: $mine-shaft;
  }
  .theme--light.v-input:not(.v-input--is-disabled) input:focus {
    color: $mine-shaft;
  }
  .theme--light.v-input.error--text input {
    color: $error-text;
  }
  .v-text-field > .v-input__control > .v-input__slot:after {
    border-width: 1px 0 0 0;
    border-color: $malibu;
  }
}
</style>
