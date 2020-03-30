<template>
  <div :style="{'left': offset + '%'}" class="timeline-item">
    <responsive-tooltip :label="tooltipLabel" :active="showTooltip">
      <a :href="scrollToId" :class="{'not-active': !allowScroll}">
        <div class="item-label">{{ label }}</div>
        <div v-if="iconType==='circle'" class="circle"></div>
        <div v-else-if="iconType==='experience'" class="svg-wrapper">
          <svg-icon name="position" width="12" height="12"></svg-icon>
        </div>
      </a>
    </responsive-tooltip>
  </div>
</template>

<script>

import 'top20common/distribution/icons/position';

import ResponsiveTooltip from '@/common/components/ResponsiveTooltip';

export default {
  props: {
    label: String,
    scrollToId: String,
    offset: Number,
    tooltipLabel: String,
    showTooltip: {
      type: Boolean,
      default: true
    },
    allowScroll: {
      type: Boolean,
      default: true
    },
    iconType: String
  },
  components: {ResponsiveTooltip}
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.timeline-item {
  position: absolute;
  display: inline-block;
  margin-top: -32px;
  text-align: center;
}

.item-label {
  font-family: $font;
  color: $dark-gray;
  font-size: $size-16;
  letter-spacing: 0.2px;
  font-weight: 500;
  margin-left: -8px;
  width: 35px;
}

.svg-wrapper {
  width: 20px;
  height: 20px;
  background: $white;
  border-radius: 100%;
  text-align: center;
  margin-top: 3px;
  .svg-icon {
    vertical-align: baseline;
  }
  /deep/ .fill {
    fill: $secondary;
  }
}

a {
  color: $primary;
}

a.not-active {
  display: block;
  pointer-events: none;
  cursor: default;
}

.circle {
  z-index: 2;
  width: 8px;
  height: 8px;
  display: inline-block;
  border: 1px solid $dark-gray-light-opacity;
  border-radius: 100%;
  background-color: $white;
}

.circle:before {
  position: absolute;
  border-bottom: 2px solid $dark-gray-light-opacity;
  width: 10px;
  height: 0;
  display: block;
  content: '';
  z-index: 1;
  margin-left: -11px;
  margin-top: 2px;
}
</style>
