<template>
  <section>
    <div v-if="experiences.length" class="experience-wrapper">
      <h3 v-translate id="firstCandidate" class="heading-3 experience-header">Work Experience</h3>

      <timeline :experiences="experiences"></timeline>

      <work-experience-meta :years="candidate.years_of_experience"
                            :months="candidate.months_of_experience"
                            :managementYears="candidate.years_of_management_experience"
                            :managementMonths="candidate.months_of_management_experience"
                            :positionsNumber="experiences.length"
                            :positionLevel="candidate.position_level"
                            :isManager="candidate.is_manager"
                            :isPipeline="candidate.is_pipeliner">
      </work-experience-meta>

      <info-block
        v-for="(item, index) in experiences"
        :id="item.start_year"
        :showDates="item.start_year"
        :headerText="item.job_title"
        :subtitle="item.company"
        :startYear="item.start_year"
        :startMonth="item.start_month"
        :endYear="item.end_year"
        :endMonth="item.end_month"
        :description="item.description"
        :descriptionHeader="descriptionLabels['experience']"
        :workingMonths="item.working_months"
        :workingYears="item.working_years"
        :key="index"
      >
        <svg-icon slot="icon" name="position"></svg-icon>
      </info-block>
    </div>

    <div v-if="projectExperience.length" class="experience-wrapper">
      <h3 v-translate id="firstCandidate" class="heading-3 experience-header">Project Experience</h3>
      <info-block
        v-for="(item, index) in projectExperience"
        :showDates="item.start_year || item.end_year"
        :headerText="item.name"
        :startYear="item.start_year"
        :startMonth="item.start_month"
        :endYear="item.end_year"
        :endMonth="item.end_month"
        :subtitle="item.role"
        :description="item.notes"
        :descriptionHeader="descriptionLabels['projectExperience']"
        :key="index"
      >
        <svg-icon slot="icon" name="position"></svg-icon>
      </info-block>
    </div>

    <div v-if="education.length" class="experience-wrapper">
      <h3 v-translate class="heading-3 experience-header">Education</h3>
      <info-block
        v-for="(item, index) in education"
        :showDates="item.start_year || item.end_year"
        :headerText="item.school"
        :subtitle="item.qualification"
        :startYear="item.start_year"
        :startMonth="item.start_month"
        :endYear="item.end_year"
        :endMonth="item.end_month"
        :key="index"><svg-icon slot="icon" name="education"></svg-icon></info-block>
    </div>

    <div v-if="trainingsAndCertifications.length" class="experience-wrapper">
      <h3 v-translate id="firstCandidate" class="heading-3 experience-header">Training &amp; Certifications</h3>
      <info-block
        v-for="(item, index) in trainingsAndCertifications"
        :showDates="item.year"
        :headerText="item.name"
        :startYear="item.year"
        :description="item.notes"
        :showEndYear="false"
        :descriptionHeader="descriptionLabels['trainingsAndCertifications']"
        :key="index">
        <svg-icon slot="icon" name="education"></svg-icon>
      </info-block>
    </div>

  </section>
</template>

<script>

import 'top20common/distribution/icons/position';
import 'top20common/distribution/icons/education';
import 'top20common/distribution/icons/candidate-large-orange';

import InfoBlock from '@/pages/profile/experience/content/InfoBlock';
import Timeline from '@/pages/profile/experience/content/Timeline';
import WorkExperienceMeta from '@/pages/profile/experience/content/WorkExperienceMeta';

export default {
  props: {
    candidate: Object
  },
  computed: {
    experiences() {
      return this.candidate && this.candidate.experience ? this.candidate.experience : [];
    },
    projectExperience() {
      return this.candidate && this.candidate.project_experience ? this.candidate.project_experience : [];
    },
    trainingsAndCertifications() {
      return this.candidate && this.candidate.trainings_and_certifications
        ? this.candidate.trainings_and_certifications
        : [];
    },
    education() {
      return this.candidate && this.candidate.education ? this.candidate.education : [];
    },
    descriptionLabels() {
      return {
        experience: this.$gettext('Responsibilities'),
        education: this.$gettext('Achievements'),
        projectExperience: this.$gettext('Achievements'),
        trainingsAndCertifications: this.$gettext('Achievements')
      };
    }
  },
  components: {
    InfoBlock,
    WorkExperienceMeta,
    Timeline
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.experience-wrapper {
  padding: 0 50px 0 0;
  word-wrap: break-word;
  margin-top: 50px;

  h3 {
    text-align: left;
    margin: 0;
    &.experience-header {
      display: inline-block;
      margin-bottom: 25px;
    }
  }
}

.desktop-icon .svg-icon {
  color: $secondary;
}
@media (max-width: $desktop) {
  .experience-wrapper {
    margin-top: 20px;
    padding: 0 0 0 0;
  }
}
/deep/ .experience-meta {
  margin-bottom: 40px;
}
</style>
