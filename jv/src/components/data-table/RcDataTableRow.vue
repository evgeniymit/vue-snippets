<template>
<div class="tr py-4">
  <slot name="cells"></slot>
</div>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/variables';

.tr {
  display: flex;
  width: 100%;
  justify-content: space-around;
  border-top: 1px solid $cornflower-blue-15;
  &:hover {
    background: $selago;
  }
}
</style>
