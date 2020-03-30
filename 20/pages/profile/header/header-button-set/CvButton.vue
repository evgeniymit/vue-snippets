<template>
  <div v-if="!isUserAccountApproved">
    <div class="flex-bar-btn-item tooltip-container">
      <responsive-tooltip :label="tooltipLabels['unlockCv']">
        <a :disabled="true" class="button is-default-icon is-default-icon-row is-primary">
          <svg-icon name="locked" width="16" height="16"></svg-icon>
          <div v-translate class="is-default-icon-item btn-title">Unlock CV</div>
        </a>
      </responsive-tooltip>
    </div>
  </div>
  <div v-else>
    <div v-if="unlockedCandidatesLoading" class="flex-bar-btn-item contact tooltip-container">
      <a v-translate class="button is-default-icon is-default-icon-row is-primary is-loading" disabled="disabled">
        Unlock CV
      </a>
    </div>
    <transition v-else name="fade" mode="out-in">
      <div v-if="isCandidateUnlocked || showOnlyDownloadButton" key="1" class="flex-bar-btn-item tooltip-container">
        <responsive-tooltip :label="tooltipLabels['downloadCv']">
          <a :href="cvUrl"
             :disabled="!cvUrl"
             target="_blank"
             class="button is-default-icon is-default-icon-row is-primary download"
             @click.middle="downloadCvEvent"
             @click="downloadCvEvent">

            <svg-icon name="cv"></svg-icon>

            <div v-translate class="is-default-icon-item btn-title">
              Download CV
            </div>
          </a>
        </responsive-tooltip>
      </div>
      <div v-else key="2" class="flex-bar-btn-item tooltip-container">
        <a class="button is-default-icon is-default-icon-row is-primary unlock-cv" @click="unlockCVHandler">
          <svg-icon name="locked" width="16" height="16"></svg-icon>
          <div v-translate class="is-default-icon-item btn-title">
            Unlock CV
          </div>
        </a>
      </div>
    </transition>
  </div>
</template>

<script>

import 'top20common/distribution/icons/cv';
import 'top20common/distribution/icons/locked';

import ResponsiveTooltip from '@/common/components/ResponsiveTooltip';

export default {
  props: {
    isUserAccountApproved: Boolean,
    tooltipLabels: Object,
    unlockedCandidatesLoading: {
      type: Boolean,
      default: true
    },
    isCandidateUnlocked: Boolean,
    showOnlyDownloadButton: Boolean,
    downloadCvEvent: Function,
    unlockCVHandler: Function,
    cvUrl: String
  },
  components: {ResponsiveTooltip}
};
</script>


<style lang="scss" scoped>
@import '~VariablesStyles';

.button.is-default {
  background: $white;
  border: none;
  box-shadow: 0 0 10px 0 $white-light-opacity;
  color: $primary;
  float: right;
}

@media (min-width: $tablet) {
  .flex-bar-btn-item {
    margin-left: 25px;
  }
}
.flex-bar-btn-item {
  .button.is-default-icon {
    /deep/ #contactSave {
      stroke: none;
    }
  }

  .button.is-default-icon:focus {
    color: $primary;
  }

  .button.is-default-icon:hover {
    color: $white;
    .svg-icon /deep/ path,
    .svg-icon /deep/ rect {
      fill: $white;
    }
  }

  .button.is-default-icon.unlock-cv:hover {
    .svg-icon /deep/ rect[pid='1'] {
      stroke: $white;
      fill: $secondary;
    }
  }

  .button.is-default-icon[disabled],
  .button.is-default-icon[disabled]:hover {
    color: $white;
    pointer-events: none;

    &.download /deep/ .svg-icon path[pid='1'] {
      fill: $mid-gray;
      stroke: $mid-gray;
    }
    .svg-icon /deep/ path {
      fill: $white;
    }
    .svg-icon /deep/ rect {
      stroke: $white;
    }
  }
}

.download {
  /deep/ .fill {
    fill: $secondary;
  }
  /deep/ .stroke {
    stroke: $white;
  }

  &:hover /deep/ {
    .fill {
      fill: $white;
    }
    .stroke {
      stroke: $secondary;
    }
  }
}
</style>
