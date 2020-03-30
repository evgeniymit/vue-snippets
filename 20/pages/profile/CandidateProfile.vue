<template>
  <div>
    <header-bar-container
      :candidate="candidate"
      :contacted="contacted"
      :loadingForCandidateDetail="loading">
    </header-bar-container>
    <candidate-experience
      :candidate="candidate"
      :errors="errors"
      :loading="loading">
    </candidate-experience>
  </div>

</template>

<script>

import GhostButtonWithIcon from '@/common/components/GhostButtonWithIcon';
import CandidateExperience from '@/pages/profile/experience/CandidateExperience';
import HeaderBarContainer from '@/pages/profile/header/HeaderBarContainer';
import HeaderBarButton from '@/pages/profile/header/header-button-set/HeaderBarButton';

export default {
  props: {
    candidate: Object,
    contacted: Boolean,
    loading: Boolean,
    errors: Object
  },
  components: {
    HeaderBarButton,
    GhostButtonWithIcon,
    HeaderBarContainer,
    CandidateExperience
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';
/deep/ {
  .aside-container {
    .progress,
    progress::-webkit-progress-value {
      background-color: $secondary;
      color: $secondary;
    }
  }
}
</style>
