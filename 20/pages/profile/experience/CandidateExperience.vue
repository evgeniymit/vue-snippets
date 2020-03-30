<template>
  <div class="max-width-container">
    <div v-if="loading && !featureSwitchesState['OBSCURE_PROFILES']">
      <div class="loader"></div>
    </div>
    <div v-else-if="errors" class="errors-box">
      <div v-for="(errorType, index) in errors" :key="index">
        <div v-for="(errorItem, index) in errorType" :key="index">
          <b-message type="is-danger">
            {{ errorItem }}
          </b-message>
        </div>
      </div>
    </div>
    <div v-else class="columns experience-candidate-flex-row">
      <div class="column is-narrow candidate-detail-page">
        <candidate-experience-loader v-if="isObscureLoading"></candidate-experience-loader>
        <candidate-experience-locked v-else-if="isExperienceLocked"></candidate-experience-locked>
        <div v-else class="primary-box">
          <template v-if="breadcrumbsLinkLabel && !$browserDetermine.isIE11()">
            <a class="primary-link paragraph-s breadcrumbs" @click="goBack">
              <span class="arrow">← </span><span>{{ breadcrumbsLinkLabel }}</span>
            </a>
          </template>
          <personal-information :candidate="candidate"></personal-information>
          <div v-if="candidate">
            <section v-if="candidate.summary">
              <h3 v-translate class="heading-3 summary-info-header">Summary</h3>
              <summary-bar :data="candidate.summary"></summary-bar>
            </section>
            <experience-content v-if="useExperience" :candidate="candidate"></experience-content>
            <wp-content v-else :candidate="candidate"></wp-content>
          </div>
        </div>
      </div>
      <div class="column is-narrow candidate-detail-page">
        <div class="secondary-box">
          <aside-component v-if="isObscureLoading || pipelineStatusPresent" :title="labels['pipelineStatus']" :isLoading="isObscureLoading">
            <manage-pipeline-status slot="header-bar" :candidate="candidate"/>
            <pipeline-status :candidate="candidate"></pipeline-status>

          </aside-component>
          <aside-component v-if="!loading && featureSwitchesState['ADMIN_TOOLS_PERMANENT']" :title="labels['adminTools']">
            <edit-candidate :candidate="candidate"></edit-candidate>
          </aside-component>
          <aside-component v-if="isObscureLoading || checkReasons(candidate)" :title="labels['motivators']" :isLoading="isObscureLoading">
            <motivators :candidate="candidate"></motivators>
          </aside-component>
          <aside-component v-if="isObscureLoading || checkSkills(candidate)" :title="labels['skills']" :isLoading="isObscureLoading">
            <aside-bar :items="skills" :showProgressBar="true"></aside-bar>
          </aside-component>
          <aside-component v-if="isObscureLoading || checkLanguages(candidate)" :title="labels['languages']" :isLoading="isObscureLoading">
            <aside-bar :items="languages"></aside-bar>
          </aside-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {isEmpty} from 'lodash';
import {mapGetters} from 'vuex';

import AsideBar from '@/pages/profile/aside-blocks/AsideBar';
import AsideComponent from '@/pages/profile/aside-blocks/AsideComponent';
import EditCandidate from '@/pages/profile/aside-blocks/EditCandidate';
import Motivators from '@/pages/profile/aside-blocks/Motivators';
import PipelineStatus from '@/pages/profile/aside-blocks/PipelineStatus';
import CandidateExperienceLocked from '@/pages/profile/experience/CandidateExperienceLocked';
import PersonalInformation from '@/pages/profile/experience/PersonalInformation';
import SummaryBar from '@/pages/profile/experience/SummaryBar';
import WpContent from '@/pages/profile/experience/WpContent';
import ExperienceContent from '@/pages/profile/experience/content/ExperienceContent';
import CandidateExperienceLoader from '@/pages/profile/loaders/CandidateExperienceLoader';

import ManagePipelineStatus from '../aside-blocks/ManagePipelineStatus';

export default {
  props: {
    errors: Object,
    candidate: Object,
    loading: Boolean
  },
  computed: {
    ...mapGetters([
      'featureSwitchesState',
      'previousRouteNameState',
      'unlockedCandidatesState',
      'savedToAvailableActiveProjectsByCandidateIdState'
    ]),
    meta() {
      return this.$store.getters.contactedCandidatesState.meta;
    },
    contacted() {
      return (
        this.candidate && this.$store.getters.contactedToAvailableActiveProjectsByCandidateIdState[this.candidate.id]
      );
    },
    pipelineStatusPresent() {
      if (isEmpty(this.candidate)) {
        return false;
      }
      return (
        (this.contacted && this.contacted.purpose && this.meta && this.meta.statuses) ||
        (this.featureSwitchesState['CANDIDATE_DOCUMENTS'] &&
          this.candidate.status !== 'pipeline' &&
          (this.savedToAvailableActiveProjectsByCandidateIdState[this.candidate.id] ||
            this.unlockedCandidatesState[this.candidate.id]))
      );
    },
    skills() {
      return this.checkSkills(this.candidate) ? this.candidate.candidate_skills : [];
    },
    languages() {
      return this.candidate ? this.candidate.languages : [];
    },
    useExperience() {
      if (this.checkContent && this.checkExperience) {
        return this.candidate && this.candidate.show_experience;
      } else {
        return !!this.checkExperience;
      }
    },
    labels() {
      return {
        pipelineStatus: this.$gettext('Pipeline Status'),
        motivators: this.$gettext('Motivators'),
        skills: this.$gettext('Skills'),
        languages: this.$gettext('Languages'),
        adminTools: this.$gettext('Admin Tools')
      };
    },
    breadcrumbsLabelsMapping() {
      return {candidates: this.$gettext('Back to search results'), projects: this.$gettext('Back to Projects')};
    },
    isObscureLoading() {
      return this.loading && this.featureSwitchesState['OBSCURE_PROFILES'];
    },
    isExperienceLocked() {
      return this.candidate && this.candidate.is_locked;
    },
    breadcrumbsLinkLabel() {
      return this.breadcrumbsLabelsMapping[this.previousRouteNameState];
    }
  },
  methods: {
    checkExperience(candidate) {
      if (candidate && candidate.experience) {
        return candidate.experience.length !== 0;
      }
    },
    checkReasons(candidate) {
      if (candidate && candidate.leave_reasons) {
        return candidate.leave_reasons.length !== 0;
      }
    },
    checkContent(candidate) {
      if (candidate) {
        return candidate.content;
      }
    },
    checkSkills(candidate) {
      if (candidate && candidate.candidate_skills) {
        return candidate.candidate_skills.length !== 0;
      }
    },
    checkLanguages(candidate) {
      if (candidate && candidate.languages) {
        return candidate.languages.length !== 0;
      }
    },
    goBack() {
      const destinationMapping = {candidates: 'Search Results', projects: 'Projects'};
      this.$mam.trackBackFromProfileClick(destinationMapping[this.previousRouteNameState]);
      this.$router.go(-1);
    }
  },
  components: {
    ManagePipelineStatus,
    AsideComponent,
    Motivators,
    AsideBar,
    WpContent,
    EditCandidate,
    PersonalInformation,
    SummaryBar,
    ExperienceContent,
    PipelineStatus,
    CandidateExperienceLoader,
    CandidateExperienceLocked
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';
.errors-box {
  margin-top: 30px;
}
.loader {
  font-size: 50px;
  margin: 30px auto;
  z-index: 9999999;
}
.experience-candidate-flex-row {
  justify-content: space-between;
}
.max-width-container {
  margin-top: 31px;
  margin-bottom: 50px;
}
.secondary-box {
  max-width: 240px;
  width: 240px;
}
.primary-box {
  width: 960px;
  max-width: 960px;
}
.candidate-detail-page {
  padding: 0;
}

@media (max-width: $desktop) {
  .primary-box {
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
  }
  .secondary-box {
    width: 100%;
    max-width: 100%;
    margin-top: 60px;
    display: block;

    /deep/ .aside-container {
      width: auto;
      margin: 40px 20px 0 20px;
    }
  }
  /deep/ .columns {
    display: block;
  }
}

h3.summary-info-header {
  display: inline-block;
  margin: 30px 0;
}
.breadcrumbs {
  margin-left: 16px;
  .arrow {
    margin-left: -16px;
    margin-top: 4px;
  }
}
</style>
