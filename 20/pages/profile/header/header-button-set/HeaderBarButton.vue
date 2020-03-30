<template>
  <div v-if="loading" class="flex-bar-btn-item contact tooltip-container">
    <a class="button is-default-icon is-default-icon-row is-primary is-loading" disabled="disabled">{{ disabledText }}</a>
  </div>
  <div v-else class="flex-bar-btn-item contact tooltip-container">
    <responsive-tooltip :label="tooltipLabel" :active="!!tooltipLabel">
      <a v-if="isDisabled" class="button is-default-icon is-default-icon-row is-primary" disabled="disabled">
        <slot name="icon"></slot>
        <div class="is-default-icon-item btn-title">{{ disabledText }}</div>
      </a>
      <a v-else
         :disabled="isNotActiveForUser"
         :class="{'is-primary': isNotActiveForUser}"
         class="button is-default-icon is-default-icon-row"
         @mouseenter="hoverHandler"
         @click="clickHandler">
        <slot name="icon"></slot>
        <div class="is-default-icon-item btn-title">{{ label }}</div>
      </a>
    </responsive-tooltip>
  </div>
</template>

<script>

import ResponsiveTooltip from '@/common/components/ResponsiveTooltip';

export default {
  props: {
    isDisabled: Boolean,
    disabledText: String,
    isNotActiveForUser: Boolean,
    label: String,
    loading: Boolean,
    tooltipLabel: String,
    clickHandler: Function,
    hoverHandler: {type: Function, default: () => {}}
  },
  components: {
    ResponsiveTooltip
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

@media (min-width: $tablet) {
  .flex-bar-btn-item {
    margin-left: 25px;
  }
}
.flex-bar-btn-item {
  .button.is-default-icon[disabled],
  .button.is-default-icon[disabled]:hover {
    color: $white;
    pointer-events: none;

    /deep/ .svg-icon /deep/ path {
      fill: $white;
      color: $white;
    }
    .svg-icon /deep/ rect {
      stroke: $white;
    }
    & /deep/ #contactSave {
      stroke: $mid-gray;
      fill: $white;
    }
  }
  .button.is-default-icon:hover {
    /deep/ .svg-icon path {
      fill: $white;
    }
  }
}
</style>
