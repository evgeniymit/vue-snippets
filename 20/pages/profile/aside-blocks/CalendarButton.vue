<template>
  <div class="columns">
    <div class="column is-paddingless popover-container">
      <v-popover
        :auto-hide="true"
        placement="top"
        popover-class="context-menu"
        offset="0,5">
        <div class="columns is-centered">
          <div class="column is-paddingless">
            <a v-translate class="button is-primary-ghost-small">Add to Calendar</a>
          </div>
        </div>
        <div slot="popover">
          <popup-menu-item :label="items.googleCalendar" class="paragraph" @click="googleCalendar"></popup-menu-item>
          <popup-menu-item :label="items.outlookCalendar" class="paragraph" @click="outlookCalendar"></popup-menu-item>
          <popup-menu-item :label="items.appleCalendar" class="paragraph" @click="appleCalendar"></popup-menu-item>
          <popup-menu-item :label="items.otherCalendars" class="paragraph" @click="otherCalendars"></popup-menu-item>
        </div>
      </v-popover>
    </div>
  </div>
</template>

<script>

import DropdownTooltip from 'top20common/components/DropdownTooltip';
import CalendarFileGenerator from 'top20common/distribution/services/fileGenerators';

import PopupMenuItem from '@/common/components/PopupMenuItem';

export default {
  props: {
    pipelineInfo: Object,
    candidate: Object
  },
  data() {
    return {
      items: {
        googleCalendar: this.$gettext('Google'),
        outlookCalendar: this.$gettext('Outlook'),
        appleCalendar: this.$gettext('Apple'),
        otherCalendars: this.$gettext('Other(.ics)')
      }
    };
  },
  methods: {
    googleCalendar() {
      let url = `https://www.google.com/calendar/render?action=TEMPLATE&text=Interview+with+${this.candidate
        .full_name || this.pipelineInfo.candidateName}&details=Candidate+profile%3A+${
        this.pipelineInfo.link
      }%0AMessage%3A+${this.pipelineInfo.message}&location=${this.pipelineInfo.location}&dates=${
        this.pipelineInfo.startInterviewTime
      }%2F${this.pipelineInfo.endInterviewTime}`;
      window.open(url, '_blank');
    },
    outlookCalendar() {
      this.otherCalendars();
    },
    appleCalendar() {
      this.otherCalendars();
    },
    otherCalendars() {
      let generator = new CalendarFileGenerator(this.pipelineInfo);
      let a = document.createElement('A');
      a.href = URL.createObjectURL(generator.file);
      a.download = generator.name;
      a.click();
    }
  },
  components: {DropdownTooltip, PopupMenuItem}
};
</script>

<style lang="scss" scoped>
.popover-container {
  margin-top: 10px;
}
</style>
