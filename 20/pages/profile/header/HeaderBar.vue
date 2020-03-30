<template>
  <div class="header-bar">
    <div class="max-width-container">
      <header-bar-loader v-if="loadingForCandidateDetail && featureSwitchesState['OBSCURE_PROFILES']"></header-bar-loader>
      <div v-else-if="loadingForCandidateDetail && !featureSwitchesState['OBSCURE_PROFILES']" class="header-bar">
        <div class="loader"></div>
      </div>

      <template v-else-if="candidate">
        <div class="header-content columns">
          <div class="flex-bar-item candidate-position column is-paddingless is-narrow">
            <h2 :class="$mq.desktop ? 'heading-2': 'heading-3'">
              <span class="is-capitalized">{{ candidate.title }}</span>
              <candidate-badges-container :candidate="candidate"></candidate-badges-container>
            </h2>
          </div>
          <div class="flex-bar-item flex-bar-btn-row header-buttons column">
            <cv-button :isUserAccountApproved="isUserAccountApproved"
                       :tooltipLabels="tooltipLabels"
                       :unlockedCandidatesLoading="unlockedCandidatesLoading"
                       :isCandidateUnlocked="isCandidateUnlocked"
                       :downloadCvEvent="downloadCvEvent"
                       :unlockCVHandler="unlockCVHandler"
                       :showOnlyDownloadButton="!isActive"
                       :cvUrl="cvUrl"
                       class="is-pulled-right-flex">
            </cv-button>

            <header-bar-button
              v-if="isActive"
              :isDisabled="isDisabled"
              :disabledText="labels['contacted']"
              :isNotActiveForUser="!isUserAccountApproved"
              :label="labels['interested']"
              :loading="loadingForCandidateDetail || loadingForContactedCandidatesList"
              :tooltipLabel="tooltipLabels['contact']"
              :hoverHandler="$mam.trackContactCandidateHover"
              :clickHandler="showInterestedForm"
              class="is-pulled-right-flex"
            >
              <svg-icon slot="icon" class="orange-icon" name="eye" width="16" height="16"></svg-icon>
            </header-bar-button>

            <save-candidate-button-container v-if="!candidate.is_pipeliner && isActive" :candidate="candidate || {}" @post-save="cvUnlocked()"></save-candidate-button-container>
          </div>
        </div>
        <div :class="{'location-salary-left-position-desktop': (1 === categoriesJobs.length && $mq.desktop)}"
             class="location-salary-icons-bar flex-bar">
          <div v-if="candidate.city_name" class="flex-bar flex-bar-row-mobile">
            <div id="candidate-city" class="svg-wrapper">
              <svg-icon name="location"></svg-icon>
            </div>
            <p class="paragraph-bold">{{ candidate.city_name }}</p>
          </div>

          <div v-if="candidate.salary_local_value || candidate.est_salary_local_value" class="flex-bar flex-bar-row-mobile">
            <div class="svg-wrapper">
              <svg-icon name="wallet"></svg-icon>
            </div>
            <p class="paragraph-bold">
              {{ getFormattedSalary(candidate.salary_local_value || candidate.est_salary_local_value, candidate.salary_local_currency) }}
            </p>
          </div>

          <div v-if="positionLevel" class="flex-bar flex-bar-row-mobile">
            <div class="svg-wrapper">
              <manager-icon v-if="candidate.is_manager" :type="candidate.is_pipeliner ? 'blue' : 'orange'"></manager-icon>
              <svg-icon v-else :name="candidate.is_pipeliner ? 'candidate-large-blue' : 'candidate-large-orange'"></svg-icon>
            </div>
            <p class="paragraph-bold">{{ positionLevel }}</p>
          </div>
        </div>

        <div v-if="checkCategories()" class="category-header-flex-row">
          <div v-for="(title, index) in categoriesJobs" :key="index"
               :class="{'left-position': (index !== categoriesJobs.length - 1)}"
               class="category-item">
            <div>
              <span class="nowrap flex-bar flex-bar-row-mobile">
                <div class="svg-wrapper">
                  <svg-icon name="industry"></svg-icon>
                </div>
                <span :class="[{'job-category-item': title.name}, 'paragraph-bold']">{{ title.industry }}</span>
                <span v-if="title.name" class="paragraph-bold">{{ title.name }}</span>
              </span>
            </div>
          </div>
        </div>

        <div v-if="!featureSwitchesState['NEW_BADGE']" class="date-updated date-along">
          <p class="nowrap paragraph-s">
            {{ updatedTimeI18N }}
          </p>
        </div>
      </template>
    </div>

    <interested-popup-container v-if="$mq.desktop" :candidateId="candidate ? candidate.id : ''" @post-contact="cvUnlocked()"></interested-popup-container>
    <interested-popup-mobile-container v-else :candidateId="candidate ? candidate.id : ''" @post-contact="cvUnlocked()"></interested-popup-mobile-container>

  </div>
</template>

<script>

import 'top20common/distribution/icons/location';
import 'top20common/distribution/icons/wallet';
import 'top20common/distribution/icons/industry';
import 'top20common/distribution/icons/candidate-large-orange';
import 'top20common/distribution/icons/candidate-large-blue';
import 'top20common/distribution/icons/eye';

import {forEach, isEmpty} from 'lodash';
import moment from 'moment';
import ManagerIcon from 'top20common/components/icons/ManagerIcon';
import currenciesService from 'top20common/distribution/services/currencies';
import {mapGetters} from 'vuex';

import CandidateBadgesContainer from '@/common/CandidateBadgesContainer';
import HeaderBarLoader from '@/pages/profile/header/HeaderBarLoader';
import SaveCandidateButtonContainer from '@/pages/profile/header/SaveCandidateButtonContainer';
import CvButton from '@/pages/profile/header/header-button-set/CvButton';
import HeaderBarButton from '@/pages/profile/header/header-button-set/HeaderBarButton';
import InterestedPopupContainer from '@/pages/profile/header/interested/InterestedPopupContainer';
import InterestedPopupMobileContainer from '@/pages/profile/header/interested/InterestedPopupMobileContainer';

export default {
  props: {
    candidate: Object,
    contacted: Boolean,
    loadingForContactedCandidatesList: Boolean,
    cvUrl: String,
    loadingForCandidateDetail: Boolean,
    unlockedCandidatesLoading: Boolean,
    isUserAccountApproved: Boolean,
    unlockCVHandler: Function,
    cvUnlockedCallback: Function,
    project: Object
  },
  data() {
    return {
      isAlreadyUnlocked: false
    };
  },
  watch: {
    unlockedCandidates: function(newValue, oldValue) {
      if (isEmpty(oldValue) && !isEmpty(newValue)) {
        this.isAlreadyUnlocked = this.isCandidateUnlocked;
      }
    }
  },
  computed: {
    ...mapGetters([
      'featureSwitchesState',
      'unavailableContactedState',
      'accountUsersNameByIdState',
      'unavailableSavedState',
      'savedToAccountActiveProjectsByCandidateIdState'
    ]),
    unlockedCandidates() {
      return this.$store.getters.unlockedCandidatesState;
    },
    isCandidateUnlocked() {
      return Boolean(
        this.candidate && this.unlockedCandidates && this.unlockedCandidates.hasOwnProperty(this.candidate.id)
      );
    },
    isDisabled() {
      return !!(
        this.contacted ||
        this.unavailableContactedState[this.candidate.id] ||
        this.unavailableSavedState[this.candidate.id]
      );
    },
    updatedTimeI18N() {
      const updated = this.$gettext('Updated %{timeAgo}');
      return this.$gettextInterpolate(updated, {timeAgo: moment(this.candidate.published).fromNow()});
    },
    positionLevel() {
      return this.candidate.position_level;
    },
    labels() {
      return {
        contacted: this.$gettext('Contacted'),
        interested: this.$gettext('Interested')
      };
    },
    tooltipLabels() {
      const contactNotApproved = this.$gettext(
        "As soon as we approve your account you'll be able to contact candidates"
      );
      const downloadCv = this.$gettext("Download this candidate's CV");
      const noCvFile = this.$gettext('Sorry, CV is not available at the moment');
      const downloadCvDisabled = this.$gettext("As soon as we approve your account you'll be able to download CV");
      const unlockCvDisabled = this.$gettext("As soon as we approve your account, you'll be able to unlock CVs");
      return {
        contact: this.isUserAccountApproved ? this.contactLabel : contactNotApproved,
        downloadCv: this.cvUrl ? downloadCv : this.isUserAccountApproved ? noCvFile : downloadCvDisabled,
        unlockCv: this.isUserAccountApproved ? '' : unlockCvDisabled
      };
    },
    contactLabel() {
      const candidate =
        this.unavailableSavedState[this.candidate.id] || this.unavailableContactedState[this.candidate.id];
      if (candidate) {
        const helpText = this.$gettext('Already added to a project by %{author}');
        return this.$gettextInterpolate(helpText, {author: this.accountUsersNameByIdState[candidate.author_id]});
      }
      return this.contacted ? '' : this.$gettext('Book an interview with this candidate');
    },
    categoriesJobs() {
      const resultJobTitles = [];
      forEach(this.candidate.categories, category => {
        if (category.job_titles.length === 0) {
          resultJobTitles.push({
            industry: category.industry.name,
            name: '',
            slug: ''
          });
        } else if (category.job_titles.length === 1) {
          resultJobTitles.push(category.job_titles[0]);
        } else {
          forEach(category.job_titles, title => {
            resultJobTitles.push(title);
          });
        }
      });
      return resultJobTitles;
    },
    isActive() {
      return this.candidate.status === 'active';
    }
  },
  methods: {
    downloadCvEvent() {
      this.$mam.trackDownloadCv(
        this.candidate.is_pipeliner ? 'Pipeliner-profile' : 'Profile',
        this.candidate.title,
        this.savedToAccountActiveProjectsByCandidateIdState[this.candidate.id],
        this.project,
        this.candidate.city_name
      );
    },
    checkCategories() {
      return this.candidate.categories && this.candidate.categories.length;
    },
    showInterestedForm() {
      if (this.isUserAccountApproved) {
        this.$modal.show('interested-popup');
        this.$mam.trackContactCandidateClick(
          this.candidate.title,
          this.savedToAccountActiveProjectsByCandidateIdState[this.candidate.id],
          this.candidate.city_name,
          this.project
        );
      }
    },
    cvUnlocked() {
      if (!this.isAlreadyUnlocked) {
        this.cvUnlockedCallback();
        this.isAlreadyUnlocked = true;
      }
    },
    getFormattedSalary(salary, currency) {
      return currenciesService.getFormattedSalary(salary, currency);
    }
  },
  components: {
    InterestedPopupMobileContainer,
    SaveCandidateButtonContainer,
    CandidateBadgesContainer,
    CvButton,
    HeaderBarButton,
    InterestedPopupContainer,
    HeaderBarLoader,
    ManagerIcon
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.save .is-default-icon.is-default-icon-row {
  width: 100px;
}

.header-bar {
  .flex-bar-btn-row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .is-default-icon-item {
      display: flex;
      align-items: center;
    }
  }
  background: $light-gray;
  padding: 20px 20px 26px;
  .location-salary-icons-bar {
    margin-top: 20px;
    &.location-salary-left-position-desktop {
      float: left;
    }
    .flex-bar {
      p {
        margin-right: 50px;
      }
    }
  }

  .button.is-default {
    background: $white;
    border: none;
    box-shadow: 0 0 10px 0 $white-light-opacity;
    color: $primary;
    float: right;
  }
  .category-header-flex-row {
    display: flex;
    flex-wrap: wrap;
  }
  .industry-icons-bar {
    .flex-bar {
      margin-right: 30px;
    }
  }
  .flex-bar {
    display: flex;
    align-items: center;
    &.header-content {
      justify-content: space-between;
      margin: 0;
      align-items: center;
    }
  }
  .job-category-item::after {
    content: '\203A';
    margin: 10px;
    color: $icons;
  }
  span.nowrap {
    white-space: nowrap;
    margin-right: 36px;
  }
  .category-item {
    margin-top: 20px;
    display: inline-table;
    justify-content: space-between;
    flex: 1 0 auto;
    align-items: flex-end;
    &.left-position {
      flex: 0;
    }
  }
  .date-updated {
    display: flex;
    align-items: flex-end;
    p {
      color: $gray;
    }
  }
  .svg-wrapper {
    min-width: 28px;
    height: 28px;
    background: $white;
    color: $secondary;
    border-radius: 100%;
    margin-right: 10px;
    text-align: center;
  }
  .orange-icon {
    color: $secondary;
  }
  .loader {
    font-size: 50px;
    margin: 30px auto;
  }
  .save-loader {
    font-size: 16px;
    margin: 0;
  }
}

.flex-bar-item.candidate-position {
  max-width: 59%;
}

.date-along {
  flex-direction: row-reverse;
  p {
    color: $gray;
  }
}

.header-bar a[disabled='disabled'] .svg-icon {
  color: $white;
}

@media (max-width: $desktop - 10) {
  .header-bar {
    /deep/ .button.is-loading:after {
      border-color: $gray $gray $white $white !important;
    }

    span.nowrap {
      white-space: nowrap;
      margin-right: 0;
    }
    .flex-bar-btn-row.header-buttons {
      z-index: 10;
      position: fixed;
      border-top: 1px solid $mid-gray;
      bottom: 0;
      width: 100%;
      background: white;
      margin-left: -20px;

      div,
      /deep/ #saveCandidateBtn {
        width: 100%;
        position: relative;
      }

      /deep/ .button {
        border-radius: 0;
        width: 100%;

        &.is-primary[disabled] {
          background-color: $white;
          color: $gray;
          rect {
            stroke: $gray;
          }
          path {
            fill: $gray;
          }
        }
      }
    }

    .flex-bar {
      flex-direction: column;
      align-items: normal;
    }

    .flex-bar-row-mobile {
      flex-direction: row;
      margin-top: 15px;
      align-items: center;
    }

    span.nowrap {
      white-space: pre-wrap;
      align-items: baseline;
    }

    .category-item {
      margin-top: 0;
      flex: auto;
    }

    .date-updated {
      align-items: normal;
      flex-direction: column;
      margin-top: 20px;
    }
  }

  .flex-bar-item.candidate-position {
    max-width: 100%;
  }

  .flex-bar-item:last-child {
    padding-top: 0;
  }

  /deep/ .save-candidate-tooltip {
    width: 100%;
    .v-popover {
      width: 100%;
    }

    span.trigger {
      width: 100%;
    }
  }
  /deep/ span.is-primary {
    width: 100%;
  }
  /deep/ .button.is-default-icon-row {
    flex-direction: column;
    .btn-title {
      padding-left: 0;
    }
  }
}
</style>
