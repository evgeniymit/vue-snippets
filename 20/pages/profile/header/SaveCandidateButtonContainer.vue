<template>
  <div class="candidate-header-secondary-flex-item">
    <div v-if="isDisabled" id="saveCandidateBtn" class="flex-bar-btn-item save">
      <responsive-tooltip :label="disabledTooltip">
        <a class="button is-default-icon is-default-icon-row is-primary" disabled="disabled">
          <div class="is-default-icon-item icon-btn-item save-icon">
            <svg-icon name="star-on" class="saved-icon"></svg-icon>
          </div>
          <div v-translate class="is-default-icon-item btn-title">Saved</div>
        </a>
      </responsive-tooltip>
    </div>
    <save-candidate-popover-container
      v-else
      :candidate="candidate"
      position="bottom"
      source="profilePage"
      @post-save="postSave()">

      <div id="saveCandidateBtn" class="flex-bar-btn-item save">
        <responsive-tooltip :label="saveThisCandidateLabel" :active="!saved">
          <a class="button is-default-icon is-default-icon-row">
            <div v-if="loading" class="loader save-loader"></div>
            <div v-else class="is-default-icon-item icon-btn-item save-icon">
              <svg-icon :name="saved ? 'star-on': 'star-off'" :class="saved ? 'saved-icon': 'not-saved-icon'"></svg-icon>
            </div>
            <div class="is-default-icon-item btn-title">{{ savedButtonText }}</div>
          </a>
        </responsive-tooltip>
      </div>

    </save-candidate-popover-container>
  </div>
</template>

<script>

import 'top20common/distribution/icons/star-on';
import 'top20common/distribution/icons/star-off';

import {mapGetters} from 'vuex';

import ResponsiveTooltip from '@/common/components/ResponsiveTooltip';
import SaveCandidatePopoverContainer from '@/common/save-candidate/SaveCandidatePopoverContainer';

export default {
  props: {
    candidate: Object
  },
  computed: {
    ...mapGetters([
      'unavailableSavedState',
      'contactedToAccountActiveProjectsByCandidateIdState',
      'userDetailsState',
      'accountUsersNameByIdState'
    ]),
    saved() {
      return this.$store.getters.savedToAccountActiveProjectsByCandidateIdState[this.candidate.id];
    },
    isDisabled() {
      return (
        this.contactedToAccountActiveProjectsByCandidateIdState[this.candidate.id] ||
        this.unavailableSavedState[this.candidate.id]
      );
    },
    loading() {
      return this.$store.getters.eachSavedLoadingState[this.candidate.id];
    },
    saveThisCandidateLabel() {
      return this.$gettext('Save this candidate');
    },
    disabledTooltip() {
      const candidate =
        this.unavailableSavedState[this.candidate.id] ||
        this.contactedToAccountActiveProjectsByCandidateIdState[this.candidate.id];
      if (candidate.author_id === this.userDetailsState.pk) {
        return this.$gettext("You've already added this candidate to a project");
      }
      return `${this.$gettext('Already added to a project by')} ${this.accountUsersNameByIdState[candidate.author_id]}`;
    },
    savedButtonText() {
      return this.saved ? this.$gettext('Saved') : this.$gettext('Save');
    }
  },
  methods: {
    postSave() {
      this.$emit('post-save');
    }
  },
  components: {SaveCandidatePopoverContainer, ResponsiveTooltip}
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

/deep/ .trigger {
  width: 100%;
}

/deep/ .v-popover {
  width: 100%;
}

.candidate-header-secondary-flex-item {
  display: flex;
  align-items: flex-start;
  .save-candidate-tooltip {
    display: flex;
    align-items: flex-start;
  }
  /deep/ .v-popover {
    display: flex;
    align-items: flex-start;
  }
}

.icon-btn-item {
  display: flex;
  align-items: center;
}

.not-saved-icon.svg-fill {
  color: $icons;
}
.saved-icon.svg-fill {
  color: $secondary;
}

.button.is-default-icon[disabled] {
  color: $white;
  cursor: unset;
  .saved-icon {
    color: $white;
  }
}

.button.is-default-icon:hover {
  .saved-icon {
    color: $white;
  }
  .not-saved-icon /deep/ path {
    stroke: $white;
  }
}

.save .is-default-icon.is-default-icon-row {
  width: 100px;
}

.button.is-default {
  background: $white;
  border: none;
  box-shadow: 0 0 10px 0 $white-light-opacity;
  color: $primary;
  float: right;
}

.flex-bar-btn-item {
  display: flex;
  align-items: center;
}
@media (min-width: $tablet) {
  .flex-bar-btn-item {
    margin-left: 25px;
  }
}
</style>
