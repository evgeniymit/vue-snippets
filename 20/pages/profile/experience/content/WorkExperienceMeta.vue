<template>
  <div class="experience-meta columns">
    <div class="column is-two-thirds">
      <div v-if="years || months" class="paragraph-s paragraph-dark-gray">
        {{ totalWorkTimeLabel }}
      </div>
      <div v-if="years || months" class="paragraph-s paragraph-bold">
        {{ managementTimeLabel }}
      </div>
    </div>
    <div v-if="positionLevel" class="column is-one-third">
      <div :class="{'is-pulled-right': $mq.desktop}" class="seniority-container">
        <manager-icon v-if="isManager" :type="isPipeline ? 'blue' : 'orange'"></manager-icon>
        <svg-icon v-else :name="isPipeline ? 'candidate-large-blue' : 'candidate-large-orange'"></svg-icon>
        <span class="label-small is-uppercase">
          <span v-translate>Seniority:</span>
          <span>&nbsp;</span>
          <span>{{ positionLevel }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import 'top20common/distribution/icons/candidate-large-blue';
import 'top20common/distribution/icons/candidate-large-orange';

import ManagerIcon from 'top20common/components/icons/ManagerIcon';
import formatter from 'top20common/distribution/services/formatter';

export default {
  props: {
    years: Number,
    months: Number,
    managementYears: Number,
    managementMonths: Number,
    positionsNumber: Number,
    positionLevel: String,
    isPipeline: Boolean,
    isManager: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    totalWorkTimeLabel() {
      let translated = this.$ngettext(
        'of total work experience (%{n} position)',
        'of total work experience (%{n} positions)',
        this.positionsNumber
      );
      let interpolated = this.$gettextInterpolate(translated, {n: this.positionsNumber || ''});
      return this.getYearsLabel(this.years, this.months, interpolated);
    },
    managementTimeLabel() {
      const text = this.$gettext('of management experience');
      return this.getYearsLabel(this.managementYears, this.managementMonths, text);
    }
  },
  methods: {
    getYearsLabel(years, months, text) {
      if (!years && !months) {
        return '';
      }
      let label = formatter.getWorkingYearsMonthsLabel(years, months, this, ` ${this.$gettext('and')} `);
      return label + ' ' + text;
    }
  },
  components: {ManagerIcon}
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.experience-meta {
  .column {
    padding: 0;
  }
}

.experience-years-span:last-child {
  color: $primary;
}
.seniority-container {
  margin-right: 10px;
}

@media (max-width: $desktop) {
  .seniority-container {
    margin-top: 15px;
  }
}
</style>
