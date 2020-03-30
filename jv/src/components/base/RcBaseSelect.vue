<template>
  <div class="wrapper" :ref="clickOutReferenceName">
    <div
      @click="show()"
      :class="{ 'cursor-pointer': !disabled,  }"
    >
      <div class="toggle d-flex align-center rc-heading-3-text">
        <span>{{ title }}</span>
        <v-icon v-if="!disabled" color="#5984F2" size="16px">mdi-chevron-down</v-icon>
      </div>
    </div>
    <div v-if="showPopup" class="rc-popup-box">
      <div class="scroll-container" v-bar>
        <div class="scroll-content">
          <div
            v-for="(option, $index) in options"
            :key="$index"
            :class="{ active: selected ? option[optionKey] === selected[optionKey] : false }"
            class="cursor-pointer option"
            @click="onSelect(option)"
          >
            <div v-if="option" class="label rc-basic-text px-4 py-1">
              {{ option[optionKey] }}
            </div>
            <v-divider class="my-1 mr-3" />
          </div>
        </div>
      </div>
      <div class="d-flex justify-center mt-6">
        <button class="rc primary mr-2" @click="apply()">Save changes</button>
        <button class="rc grey" @click="dismiss()">Cancel</button>
      </div>
    </div>
    <div v-if="selected" class="mt-1 rc-basic-text">{{ displaySelected }}</div>
  </div>
</template>

<script>
import clickOut from '../../mixins/clickOut';

export default {
  name: 'RcBaseSelect',
  mixins: [clickOut],
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: 'Title',
    },
    optionKey: {
      type: String,
      required: true,
    },
    valueKey: {
      type: String,
      default: 'id',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: [Number, String],
  },
  data: () => ({
    clickOutReferenceName: 'popupList',
    showPopup: false,
    selected: {},
  }),
  computed: {
    displaySelected() {
      if (!this.value) {
        return 'Select a value';
      }
      const out = this.options.find(option => +option[this.valueKey] === +this.value);
      return out ? out[this.optionKey] : 'Select a value';
    },
  },
  methods: {
    show() {
      if (!this.disabled) {
        this.showPopup = true;
      }
    },
    onSelect(instance) {
      this.selected = instance;
    },
    apply() {
      const value = this.selected[this.valueKey] ? this.selected[this.valueKey] : '';
      this.$emit('input', value);
      this.onClickOut();
    },
    dismiss() {
      this.selected = Object.assign({});
      this.onClickOut();
    },
    onClickOut() {
      this.showPopup = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables';
.wrapper {
  position: relative;
  .rc-popup-box{
    width: 250px;
    z-index: 999;
  }
}
.option.active .label {
  background: $cornflower-blue-15;
}
.scroll-container {
  height: 150px;
}
</style>
