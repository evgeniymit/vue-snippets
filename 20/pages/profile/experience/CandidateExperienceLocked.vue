<template>
  <div class="experience-locked">
    <div v-translate class="warning-text paragraph-l">As soon as we approve your account you’ll have access to the full candidate profile.</div>
    <candidate-experience-loader :animate="false"></candidate-experience-loader>
    <div v-translate class="rotated">LOCKED</div>
  </div>
</template>

<script>

import CandidateExperienceLoader from '@/pages/profile/loaders/CandidateExperienceLoader';
export default {
  components: {CandidateExperienceLoader}
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';
.warning-text {
  max-width: 340px;
  padding: 25px 30px;
  border-radius: 5px;
  box-shadow: 0 0 20px 0 $shadow-box-primary-light;
  position: absolute;
  top: 20%;
  left: 30%;
  background: $white;
}
.rotated {
  color: $secondary;
  transform: rotate(-30deg);

  font-size: 200px;
  font-weight: bold;

  position: absolute;
  left: 20%;
  top: 35%;
  opacity: 0.1;
}
@media (max-width: $desktop) {
  .rotated {
    font-size: 150px;
  }
}
@media (max-width: $tablet) {
  .experience-locked {
    position: relative;
  }
  .warning-text {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    margin: 0 auto;
  }

  .rotated {
    font-size: 77px;
    width: fit-content;
    left: 0;
    right: 0;
    top: 37%;
    text-align: center;
    margin: 0;
  }
}
</style>
