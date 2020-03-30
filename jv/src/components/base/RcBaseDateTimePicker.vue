<template>
  <div>
    <div class="wrapper" :ref="clickOutReferenceName">
      <div
        v-if="label != null"
        :class="{ 'cursor-pointer': !disabled }"
        class="rc-heading-3-text d-flex align-center"
        @click="show"
      >
        <span>{{ label }}</span>
        <v-icon v-if="!disabled" color="#5984F2" size="16px">mdi-chevron-down</v-icon>
      </div>
      <div
        class="d-flex align-center pickers active-border-bottom px-1"
        :class="{ 'cursor-pointer': !disabled }"
        @click="show()"
      >
        <v-icon size="14">mdi-calendar-month-outline</v-icon>
        <span class="px-1 rc-basic-text">{{ displayDateLabel }}</span>
        <span class="px-1 rc-basic-text" v-if="!dateOnly">|</span>
        <v-icon size="14" class="px-1" v-if="!dateOnly">mdi-clock-outline</v-icon>
        <span class="px-1 rc-basic-text" v-if="!dateOnly">{{ timeLabel }}</span>
      </div>
      <div v-if="error" class="errors mt-2">
        <p v-for="e in error" :key="e" class="rc-message-text rc-error ma-0">{{ e }}</p>
      </div>
      <div v-if="showPopup" class="rc-popup-box">
        <div class="d-flex justify-space-between">
          <div
            class="flex-column cursor-pointer align-center ma-4 active-border-bottom"
            @click="showDatePiker()">
            <span class="rc-heading-3-text mb-1">Date</span>
            <span><v-icon size="14">mdi-calendar-month-outline</v-icon>{{ dateLabel }}</span>
          </div>
          <div
            v-if="!dateOnly"
            class="flex-column cursor-pointer align-center ma-4 active-border-bottom"
            @click="showTimePiker()"
          >
            <span class="rc-heading-3-text mb-1">Time</span>
            <span><v-icon size="14">mdi-clock-outline</v-icon>{{ timeLabel }}</span>
          </div>
        </div>
        <v-date-picker v-if="showDate" full-width v-model="date" no-title />
        <v-time-picker v-if="showTime && !dateOnly" v-model="time" no-title />
        <div class="d-flex justify-center mt-6">
          <button
            class="rc primary mr-2"
            @click="apply()">
            Save changes
          </button>
          <button
            class="rc grey"
            @click="cancel()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import config from '@/const/config';
import clickOut from '@/mixins/clickOut';

const ISO_DATE_TIME_TEMPLATE = 'YYYY-MM-DDTHH:mm';

export default {
  name: 'RcBaseDateTimePicker',
  props: {
    displayDate: {
      type: [String, null],
    },
    value: {
      type: [String, null],
    },
    label: {
      type: String,
      default: 'Deadline',
    },
    dateOnly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    error: Array,
  },
  mixins: [clickOut],
  data() {
    return {
      date: this.displayDate ? moment(this.displayDate, 'YYYY-MM-DD').format('Y-M-D') : null,
      time: this.displayDate ? moment(this.displayDate).format('hh:mm') : null,
      clickOutReferenceName: 'popup',
      showPopup: false,
      showDate: true,
      showTime: false,
    };
  },
  computed: {
    dateLabel() {
      if (this.date) {
        return moment(this.date, 'YYYY-MM-DD').format(config.dateFormat);
      }
      return config.dateFormat;
    },
    displayDateLabel() {
      if (this.displayDate || this.value) {
        return moment(this.displayDate || this.value, ISO_DATE_TIME_TEMPLATE)
          .format(config.dateFormat);
      }
      return config.dateFormat;
    },
    timeLabel() {
      if ((this.displayDate || this.value) && !this.dateOnly) {
        return moment(this.displayDate || this.value, ISO_DATE_TIME_TEMPLATE)
          .format(config.timeFormat);
      }
      return config.timeFormat;
    },
  },
  methods: {
    show() {
      if (!this.disabled) {
        this.showPopup = true;
      }
    },
    apply() {
      this.$emit('submit', `${this.date}T${this.time ? this.time : '12:00'}`);
      this.$emit('input', `${this.date}T${this.time ? this.time : '12:00'}`);
      this.onClickOut();
    },
    cancel() {
      this.showPopup = false;
      this.date = moment(this.displayDate).format('Y-M-D');
      this.time = moment(this.displayDate).format('hh:mm');
    },
    onClickOut() {
      this.showPopup = false;
    },
    showDatePiker() {
      this.showDate = true;
      this.showTime = false;
    },
    showTimePiker() {
      this.showDate = false;
      this.showTime = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables';

.deadline-wrapper {
  position: relative;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.active-border-bottom {
  border-bottom: 1px solid $malibu;
}

.rc-popup-box {
  z-index: 999;
  width: 300px;
}

.pickers {
  border-radius: 8px;
  min-width: 100px;
  height: 26px;
  border-bottom: none;
  background: none;
}

.v-picker {
  box-shadow: none;
}
</style>
