<template>
<button
  ref="button"
  @click="$emit('click')"
  :style="{ background }"
  :disabled="disabled"
>
  <v-icon :color="getIconColor" size="12px">mdi-{{ icon }}</v-icon>
</button>
</template>

<script>
export default {
  name: 'TinyButton',
  props: {
    color: { type: String, default: 'blue' },
    icon: { type: String, default: 'pencil-outline' },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      iconColor: '',
      background: '',
      disabledIconColor: '',
    };
  },
  computed: {
    getIconColor() {
      return this.disabled ? this.disabledIcon : this.iconColor;
    },
  },
  mounted() {
    const getCSSVariableName = value => getComputedStyle(this.$refs.button)
      .getPropertyValue(`--color-${this.color}-${value}`).trim();
    this.iconColor = getCSSVariableName('icon');
    this.background = getCSSVariableName('background');
    this.disabledIconColor = getCSSVariableName('disabled');
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables';

button {
  --color-red-background: #{$fair-pink};
  --color-blue-background: #{$hawkes-blue};
  --color-red-icon: #{$geraldine};
  --color-blue-icon: #{$primary};
  --color-disabled-icon: #{$silver};
  width: 30px;
  min-width: 30px;
  height: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: var(--color-fair-pink);

  &[disabled] {
    background-color: $gallery !important;
    color: $silver !important;
    cursor: default
  }
}
</style>
