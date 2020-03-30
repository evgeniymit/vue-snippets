<template>
  <div v-if="canShowTimeline" class="experience-timeline">
    <timeline-item v-for="(experiences, year) in groupedExperiences"
                   :key="year"
                   :label="getFormattedLabel(year)"
                   :iconType="getType(experiences)"
                   :scrollToId="'#' + year"
                   :offset="getOffsetPercentage(year)"
                   :tooltipLabel="getTooltipLabel(experiences)"
                   :showTooltip="Boolean(experiences.length)"
                   :allowScroll="Boolean(experiences.length) && allowScroll">
    </timeline-item>
  </div>
</template>

<script>

import {map, min} from 'lodash';
import moment from 'moment';
import formatter from 'top20common/distribution/services/formatter';

import TimelineItem from '@/pages/profile/experience/content/TimelineItem';

export default {
  props: {
    experiences: Array,
    allowScroll: {type: Boolean, default: true}
  },
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  },
  computed: {
    canShowTimeline() {
      return this.experiences.length && this.hasAnyStartYear;
    },
    hasAnyStartYear() {
      for (let i = 0; i < this.experiences.length; i++) {
        if (this.experiences[i].start_year) {
          return true;
        }
      }
    },
    totalYearsToTrim() {
      return this.$mq.desktop ? 20 : 10;
    },
    groupedExperiences() {
      let grouped = {};
      for (let i in this.experiences) {
        let startYear = this.experiences[i].start_year;
        if (startYear) {
          grouped[startYear] = grouped[startYear] || [];
          grouped[startYear].push(this.experiences[i]);
        }
      }
      grouped[this.currentYear] = grouped[this.currentYear] || [];
      return grouped;
    },
    lastYear() {
      return this.currentYear;
    },
    firstYear() {
      return min(
        this.experiences.map(function(el) {
          return el.start_year;
        })
      );
    },
    totalTime() {
      return this.lastYear - this.firstYear;
    }
  },
  methods: {
    getOffsetPercentage(year) {
      return (year - this.firstYear) / this.totalTime * 100;
    },
    getType(experiences) {
      return experiences.length ? 'experience' : 'circle';
    },
    getTooltipLabel(experiences) {
      let overviews = [];
      for (let i in experiences) {
        overviews.push(this.getOverview(experiences[i]));
      }
      return overviews.join('\n');
    },
    getOverview(exp) {
      let parts = [
        this.renderMonth(exp.start_month),
        exp.start_year,
        '-',
        this.renderMonth(exp.end_month),
        (exp.end_year || this.$gettext('Present')) + ':',
        exp.job_title,
        exp.job_title && exp.company ? this.$pgettext('JobTitle at Company', 'at') : '',
        exp.company,
        exp.working_months || exp.working_years ? this.getWorkingRange(exp) : ''
      ];
      return parts.filter(Boolean).join(' ');
    },
    getWorkingRange(exp) {
      return '(' + formatter.getWorkingYearsMonthsLabel(exp.working_years, exp.working_months, this) + ')';
    },
    renderMonth(monthNumber) {
      return monthNumber ? moment(monthNumber, 'MM').format('MMM') : '';
    },
    getFormattedLabel(year) {
      if (this.groupedExperiences[year] && !this.groupedExperiences[year].length) {
        return this.$gettext('NOW');
      }

      let edgeYear = !parseInt(year) || parseInt(year) === this.firstYear || parseInt(year) === this.lastYear;
      let noTrim = this.totalTime < this.totalYearsToTrim;

      if (noTrim || edgeYear) {
        return year;
      }

      const existingYears = map(Object.keys(this.groupedExperiences), item => {
        return parseInt(item);
      });
      const prev = parseInt(year) - 1;
      const next = parseInt(year) + 1;
      return existingYears.indexOf(prev) >= 0 || existingYears.indexOf(next) >= 0 ? "'" + year.slice(2) : year;
    }
  },
  components: {
    TimelineItem
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.experience-timeline {
  width: 97%;
  position: relative;
  border-top: 2px solid $dark-gray-light-opacity;
  padding-bottom: 20px;
  margin-top: 30px;
}
</style>
