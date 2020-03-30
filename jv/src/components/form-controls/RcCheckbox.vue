<template>
<div class="rc-checkbox-component">
  <v-checkbox
    :input-value="value"
    :label="label"
    :hide-details="hideDetails"
    :indeterminate="indeterminate"
    :disabled="disabled"
    color="primary"
    @change="$emit('input', $event ? $event : false)"
    class="mt-0"
  />
</div>
</template>

<script>
export default {
  name: 'RcCheckbox',
  props: {
    value: {
      type: Boolean,
    },
    label: String,
    hideDetails: {
      type: Boolean,
      default: true,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
  @import '../../assets/styles/typography';
  @import '../../assets/styles/variables';

  .rc-checkbox-component {
    .v-input--selection-controls__ripple {
      display: none;
    }
    label.v-label {
      @extend .rc-basic-text;
      color: $mine-shaft;
    }
  }
</style>
