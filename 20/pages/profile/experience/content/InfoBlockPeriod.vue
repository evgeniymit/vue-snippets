<template>
  <div :class="$mq.desktop ? 'has-text-right is-pulled-right': 'has-text-left is-pulled-left'">
    <div v-if="showDates">
      <span v-if="startYear" class="paragraph-xs period-header-item paragraph-bold-heavy is-uppercase">{{ renderMonth(startMonth) }} {{ startYear }}</span>
      <span v-if="showEndYear" class="paragraph-xs period-header-item paragraph-bold-heavy is-uppercase">
        <span v-if="startYear"> - </span>
        {{ renderMonth(endMonth) }} {{ endYear || presentLabel }}
      </span>
      <div class="paragraph-s paragraph-dark-gray is-lowercase">
        <span v-if="workingYears">{{ workingYearsLabel }}</span>
        <span v-if="workingMonths && workingYears">&nbsp;</span>
        <span v-if="workingMonths">{{ workingMonthsLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script>

import moment from 'moment';

export default {
  props: {
    showEndYear: {default: true, type: Boolean},
    showDates: [Boolean, Number],
    startYear: [String, Number],
    startMonth: [String, Number],
    endYear: [String, Number],
    endMonth: [String, Number],
    workingYears: Number,
    workingMonths: Number
  },
  computed: {
    presentLabel() {
      return this.$gettext('Present');
    },
    workingYearsLabel() {
      let translatedYears = this.$ngettext('%{n} year', '%{n} years', this.workingYears);
      return this.workingYears ? this.$gettextInterpolate(translatedYears, {n: this.workingYears}) : '';
    },
    workingMonthsLabel() {
      let translatedMonths = this.$ngettext('%{n} month', '%{n} months', this.workingMonths);
      return this.workingMonths ? this.$gettextInterpolate(translatedMonths, {n: this.workingMonths}) : '';
    }
  },
  methods: {
    renderMonth(monthNumber) {
      return monthNumber ? moment(monthNumber, 'MM').format('MMM') : '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.period-header-item {
  letter-spacing: 0.2px;
  color: $secondary;
  opacity: 0.8;
}
</style>
