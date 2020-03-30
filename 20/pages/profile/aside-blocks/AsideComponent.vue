<template>
  <div class="aside-container">
    <candidate-side-bar-loader v-if="isLoading"></candidate-side-bar-loader>

    <template v-else>
      <h3 class="heading-3">{{ title }}</h3>
      <slot name="header-bar"></slot>
      <div class="aside-list">
        <slot></slot>
      </div>
    </template>
  </div>
</template>

<script>

import CandidateSideBarLoader from '@/pages/profile/loaders/CandidateSideBarLoader';

export default {
  props: {
    title: String,
    isLoading: {type: Boolean, default: false}
  },
  components: {CandidateSideBarLoader}
};
</script>

<style scoped lang="scss">
@import '~VariablesStyles';

.aside-container {
  padding: 15px;
  width: 240px;
  min-width: 240px;
  padding-bottom: 26px;
  box-shadow: 0 0 20px 0 $shadow-box-primary-light;
  margin-bottom: 30px;
}
.aside-list {
  margin-top: 10.5px;
  border-top: solid 1px $light-gray;
}

@media (max-width: $desktop) {
  .aside-container {
    margin: 15px auto;
  }
}
</style>
