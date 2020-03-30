<template>
  <div class="info-block-box experience-flex-row">
    <div class="experience-flex-item card-box">
      <div class="columns flex-columns-tablet">
        <div v-if="$mq.desktop" class="column is-2-desktop is-pulled-left is-paddingless margin-top">

          <info-block-period
            :showDates="showDates"
            :startYear="startYear"
            :startMonth="startMonth"
            :endYear="endYear"
            :endMonth="endMonth"
            :showEndYear="showEndYear"
            :workingYears="workingYears"
            :workingMonths="workingMonths"
          ></info-block-period>
        </div>

        <div v-if="$mq.desktop" class="column has-text-centered is-paddingless is-narrow desktop-icon">
          <slot name="icon"></slot>
        </div>

        <div class="column is-9-desktop is-12-tablet info-content is-paddingless">
          <div>
            <p class="paragraph-bold paragraph-l is-capitalized">{{ headerText }}</p>
            <p class="paragraph-m paragraph-dark-gray">{{ subtitle }}</p>

            <div v-if="!$mq.desktop" class="column is-12-tablet is-12-mobile is-pulled-left info-content">

              <div v-if="$slots.icon" class="has-text-centered icon-column is-pulled-left">
                <div class="white-circle">
                  <slot name="icon"></slot>
                </div>
              </div>

              <info-block-period
                :showDates="showDates"
                :startYear="startYear"
                :startMonth="startMonth"
                :endYear="endYear"
                :endMonth="endMonth"
                :showEndYear="showEndYear"
                :workingYears="workingYears"
                :workingMonths="workingMonths"
              ></info-block-period>

            </div>

            <div class="responsibilities-box">
              <p class="paragraph-xs paragraph-dark-gray paragraph-bold is-uppercase">{{ descriptionHeader }}</p>
              <p class="description-block" v-html="description"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import InfoBlockPeriod from '@/pages/profile/experience/content/InfoBlockPeriod';

export default {
  props: {
    showDates: [Boolean, Number],
    showEndYear: {default: true, type: Boolean},
    headerText: [String, Number],
    subtitle: String,
    startYear: [String, Number],
    startMonth: [String, Number],
    endYear: [String, Number],
    endMonth: [String, Number],
    description: String,
    descriptionHeader: String,
    workingYears: Number,
    workingMonths: Number
  },
  components: {InfoBlockPeriod}
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.white-circle {
  width: 28px;
  height: 28px;
  color: $secondary;
  background-color: $white;
  border-radius: 50%;
  opacity: 0.8;
}

.desktop-icon {
  margin-left: 18px;
  margin-right: 16px;
}

.info-block-box {
  margin-bottom: 41px;
  /deep/ {
    ul {
      list-style: inherit;
      margin-left: 25px;
    }
    li {
      list-style: inherit;
      margin: 5px 0;
    }
  }
}

.margin-top {
  margin-top: 1px;
}

.responsibilities-box p.experience-description > p {
  font-size: $size-13;
}

.responsibilities-box .description-block /deep/ p {
  font-size: $size-12;
}

.responsibilities-box p.paragraph-xs {
  margin: 14px 0;
}
@media (max-width: $desktop) {
  .period-container {
    width: 100%;
  }

  .icon-column {
    padding-top: 0;
    padding-right: 10px;
  }
  .flex-columns-tablet {
    flex-direction: column;
  }
  .info-content {
    padding-left: 0;
  }
  .info-block-box {
    margin-bottom: 20px;
  }

  /deep/ .work-duration {
    text-align: left;
  }
}
</style>
