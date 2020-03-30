<template>
  <div class="candidate-page">
    <div class="container">
      <div class="columns">
        <div class="column">
          <candidate-container></candidate-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import CandidateContainer from '@/pages/profile/CandidateContainer';

export default {
  created() {
    document.head.querySelector('meta[name=viewport]').content = 'width=device-width, initial-scale=1';
  },
  destroyed() {
    document.head.querySelector('meta[name=viewport]').content =
      'width=device-width, initial-scale=0.1, maximum-scale=1, user-scalable=yes';
  },
  components: {
    CandidateContainer
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.column {
  padding: 0;
}
</style>
