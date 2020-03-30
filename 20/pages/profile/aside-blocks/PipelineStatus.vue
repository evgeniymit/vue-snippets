<template>
  <div class="pipeline-status-wrapper">
    <pipeline-status-block :title="title">
      <svg-icon slot="icon" name="candidate-large-orange" width="16" height="16"></svg-icon>
      <template slot="content">{{ description }}</template>
    </pipeline-status-block>

    <pipeline-status-block v-if="contacted && contacted.interview_time && contacted.is_interview && metaStatus.interview_message" :title="metaStatus.interview_message" >
      <svg-icon slot="icon" name="clock" width="16" height="16" class="clock"></svg-icon>
      <template slot="content">
        <div>{{ candidateDateInterview }}</div>
        <calendar-button
          v-if="featureSwitchesState['INTERVIEW_SCHEDULE'] && isContactedStatusScheduled"
          :pipelineInfo="pipelineInfo" :candidate="candidate">
        </calendar-button>
      </template>
    </pipeline-status-block>

    <pipeline-status-block v-if="contacted && contacted.client_message" :title="labels.message">
      <svg-icon slot="icon" name="contact" width="16" height="16"></svg-icon>
      <template slot="content">{{ contacted.client_message }}</template>
    </pipeline-status-block>

    <pipeline-status-block v-if="documentsPresent" :title="labels.documents">
      <svg-icon slot="icon" name="cv" width="16" height="16"></svg-icon>
      <template slot="content">
        <div v-for="link in documentLinks" :key="link.href">
          <a :href="link.href" target="_blank">{{ link.name }}</a>
        </div>
      </template>
    </pipeline-status-block>
  </div>
</template>

<script>

import 'top20common/distribution/icons/contact';
import 'top20common/distribution/icons/candidate-large-orange';
import 'top20common/distribution/icons/clock';
import 'top20common/distribution/icons/cv';

import {map} from 'lodash';
import formatter from 'top20common/distribution/services/formatter';
import {mapGetters} from 'vuex';

import CalendarButton from '@/pages/profile/aside-blocks/CalendarButton';
import PipelineStatusBlock from '@/pages/profile/aside-blocks/PipelineStatusBlock';

export default {
  props: {
    candidate: Object
  },
  computed: {
    ...mapGetters([
      'featureSwitchesState',
      'savedToAvailableActiveProjectsByCandidateIdState',
      'contactedToAvailableActiveProjectsByCandidateIdState',
      'projectsByCandidateIdState',
      'unlockedCandidatesState'
    ]),
    labels() {
      return {
        cvUnlocked: this.$gettext('CV Unlocked'),
        unlockedDescription: this.$gettext(
          'Congratulations! You\'ve unlocked CV for this candidate. Use the "Download CV" button in order to get it.'
        ),
        shortlisted: this.$gettext('Shortlisted'),
        saved: this.$gettext('Saved'),
        savedDescription: this.$gettext("You've saved this candidate."),
        handpickedDescription: this.$gettext("We've handpicked this candidate for you."),
        clickInterestDescription: this.$gettext('Consider clicking "Interested" if you want to move forward.'),
        message: this.$gettext('Message'),
        documents: this.$gettext('Documents')
      };
    },
    title() {
      if (this.contacted) {
        return this.metaStatus.status;
      } else if (this.saved) {
        return this.saved.is_sourced ? this.labels.shortlisted : this.labels.saved;
      }
      return this.labels.cvUnlocked;
    },
    description() {
      if (this.contacted) {
        return this.metaStatus.message;
      } else if (this.saved) {
        return this.savedCandidateDescription;
      }
      return this.labels.unlockedDescription;
    },
    savedCandidateDescription() {
      const description = this.saved.is_handpicked ? this.labels.handpickedDescription : this.labels.savedDescription;
      return `${description} ${this.labels.clickInterestDescription}`;
    },
    localTime() {
      const local = new Date(this.contacted.interview_time);
      local.setHours(local.getHours() + local.getTimezoneOffset() / 60);
      return local;
    },
    fromTime() {
      return this.localTime.toISOString().replace(/:|-|(\.\d+)/g, '');
    },
    toTime() {
      const local = this.localTime;
      local.setHours(local.getHours() + 1);
      return local.toISOString().replace(/:|-|(\.\d+)/g, '');
    },
    pipelineInfo() {
      return {
        candidateName: this.contacted.full_name || this.contacted.candidate.name,
        link: `${window.location.origin}${formatter.getCandidateDetailUrl(this.contacted.candidate)}`,
        message: this.contacted.client_message || '-',
        location: this.contacted.interview_address || '-',
        startInterviewTime: this.fromTime,
        endInterviewTime: this.toTime
      };
    },
    candidateDateInterview() {
      return this.$getDateMoment(this.contacted.interview_time, 'lll');
    },
    metaStatus() {
      return this.meta.statuses[this.contacted.status];
    },
    meta() {
      return this.$store.getters.contactedCandidatesState.meta;
    },
    contacted() {
      return this.contactedToAvailableActiveProjectsByCandidateIdState[this.candidate.id];
    },
    saved() {
      return this.savedToAvailableActiveProjectsByCandidateIdState[this.candidate.id];
    },
    isContactedStatusScheduled() {
      return this.contacted && this.contacted.status === 'interview';
    },
    documentLinks() {
      let cvHref =
        this.unlockedCandidatesState[this.candidate.id] ||
        (this.saved && this.saved.cv_url) ||
        (this.contacted && this.contacted.cv_url);
      let linksData = map(this.candidate.links, link => {
        return {href: link.url, name: link.name};
      });
      let documentsData = map(this.candidate.documents, document => {
        return {href: document.file, name: document.name};
      });
      const cv = {name: this.$gettext('CV'), href: cvHref};
      return cvHref ? [cv, ...linksData, ...documentsData] : [...linksData, ...documentsData];
    },
    documentsPresent() {
      return this.documentLinks.length && this.featureSwitchesState['CANDIDATE_DOCUMENTS'];
    }
  },
  components: {
    CalendarButton,
    PipelineStatusBlock
  }
};
</script>
<style scoped lang='scss'>
@import '~VariablesStyles';

.pipeline-status-wrapper {
  .svg-icon {
    color: $secondary;
  }
  /deep/ .clock path {
    stroke: $white;
  }
  /deep/ .stroke {
    stroke: $white;
  }
}
</style>
