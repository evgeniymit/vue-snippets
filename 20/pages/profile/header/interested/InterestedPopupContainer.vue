<template>
  <modal-dialog :pivotY="0.07" :width="510" :name="modalName" height="auto" @before-open="beforeOpen" @before-close="beforeClose">
    <div class="interested-popup-container">
      <slot name="heading"><h3 v-translate class="heading-3">Contact request sent.</h3></slot>
      <contact-description v-if="description" :description="description"></contact-description>
      <div class="project-select-field">
        <b-field :label="labels.project">
          <multiselect-field
            :options="projectsList"
            :value="defaultProject"
            :iconField="false"
            :close-on-select="true"
            :hide-selected="true"
            :searchable="false"
            :placeholder="labels.selectProject"
            :isPositionFixed="true"
            track-by="id"
            label="displayedTitle"
            @input="handleChangeProject"
          ></multiselect-field>
        </b-field>
      </div>

      <div class="purpose-select-field">
        <b-field :label="labels.purpose">
          <multiselect-field
            :options="purposes"
            :value="defaultPurpose"
            :iconField="false"
            :close-on-select="true"
            :hide-selected="true"
            :searchable="false"
            :isPositionFixed="true"
            track-by="type"
            label="title"
            @input="handleChangePurpose"
          ></multiselect-field>
        </b-field>
      </div>

      <b-field :label="labels.message">
        <b-input
          :value="initialData.message || null"
          name="message"
          type="textarea"
          class="text-area"
          @input.native="handleChangeField"
        ></b-input>
      </b-field>

      <b-field v-show="showPhoneField"
               :label="labels.phone"
               :type="getFieldType('phone_number')"
               :message="getErrorMessage('phone_number')"
               class="phone">
        <input-field
          :value="initialData.phone_number"
          name="phone_number"
          @input.native="handleChangeField"
          @keyup.native.enter="updateContactedCandidate"
        ></input-field>
      </b-field>

      <div v-show="showInterviewField" class="flex-box">
        <b-field :label="labels.interviewDate"
                 :type="getFieldType('interview_time')"
                 :message="getErrorMessage('interview_time')"
                 class="date">
          <datepicker-input
            :value="initialData.date"
            :readonly="false"
            :min-date="minDate"
            :dateFormatter="formatDate"
            :max-date="maxDate"
            :placeholder="labels.interviewDate"
            :dayNames="dayNamesTranslated"
            :monthNames="monthNamesTranslated"
            position="is-top-right"
            name="date"
            @input="handleDatePick"
          ></datepicker-input>
        </b-field>

        <b-field :label="labels.time" class="time">
          <timepicker-input
            :value="initialData.time"
            :minute-interval="5"
            hide-clear-button
            @change="handleTimePick"
          ></timepicker-input>
        </b-field>
      </div>

      <b-field v-show="showAddressField" :label="labels.address" :message="getErrorMessage('interview_address')">
        <input-field :value="initialData.interview_address" name="interview_address" @keyup.native.enter="updateContactedCandidate" @input.native="handleChangeField">
        </input-field>
      </b-field>

      <slot
        :handleChangeField="handleChangeField"
        name="client-message">
      </slot>

      <slot
        :handleChangeField="handleChangeField"
        :updateContactedCandidate="updateContactedCandidate"
        :handleChangeStatus="handleChangeStatus">
      </slot>

      <div class="flex-box controls">
        <button
          :class="{ 'is-loading': interestedFormState.loading }"
          class="button is-accent-default"
          @click="updateContactedCandidate"
        >
          <translate>Update Request</translate>
        </button>
        <button v-translate class="button is-accent-ghost is-pulled-right-flex" @click="hideModal">Close</button>
      </div>
    </div>
  </modal-dialog>
</template>

<script>

import {forEach, pickBy} from 'lodash';
import moment from 'moment';
import DatepickerInput from 'top20common/components/DatepickerInput';
import InputField from 'top20common/components/InputField';
import ModalDialog from 'top20common/components/ModalDialog';
import MultiselectField from 'top20common/components/MultiselectField';
import translated from 'top20common/distribution/services/translated-data';
import {mapGetters} from 'vuex';

import TimepickerInput from '@/common/components/TimepickerInput';
import ContactDescription from '@/pages/profile/header/interested/ContactDescription';
import projects from '@/services/projects';

export default {
  props: {
    candidateId: String,
    modalName: {type: String, default: 'interested-popup'},
    conditionalFields: {type: Boolean, default: true}
  },
  data() {
    let minDate = new Date();
    let maxDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    maxDate.setDate(maxDate.getDate() + 1080);

    return {
      selectedPurposeType: null,
      minDate,
      maxDate
    };
  },
  computed: {
    ...mapGetters([
      'projectsByCandidateIdState',
      'userDetailsState',
      'interestedFormState',
      'savedToAccountActiveProjectsByCandidateIdState',
      'featureSwitchesState',
      'savedByCandidateIdState'
    ]),
    descriptions() {
      return {
        interest: this.$gettext(
          'Your Relationship Manager will reach out to this candidate to verify their interest in your company.'
        ),
        info: this.$gettext('Your Relationship Manager will reach out to this candidate to get more information.'),
        phone: this.$gettext('Your Relationship Manager will reach out to this candidate to schedule a phone screen.'),
        interview: this.$gettext(
          'Your Relationship Manager will reach out to this candidate to schedule an interview.'
        ),
        other: this.$gettext('Your Relationship Manager will reach out to this candidate.')
      };
    },
    description() {
      return this.descriptions[this.defaultPurpose.type];
    },
    showPhoneField() {
      if (!this.conditionalFields) {
        return true;
      }
      return this.defaultPurpose.type === 'interview' || this.defaultPurpose.type === 'phone';
    },
    showInterviewField() {
      if (!this.conditionalFields) {
        return true;
      }
      return this.defaultPurpose.type === 'interview' || this.defaultPurpose.type === 'phone';
    },
    showAddressField() {
      if (!this.conditionalFields) {
        return true;
      }
      return this.defaultPurpose.type === 'interview';
    },
    purposes() {
      return [
        {title: this.$gettext("Check candidate's interest"), type: 'interest'},
        {title: this.$gettext('Get more information about candidate'), type: 'info'},
        {title: this.$gettext('Schedule a phone screen'), type: 'phone'},
        {title: this.$gettext('Schedule an interview'), type: 'interview'},
        {title: this.$gettext('Other'), type: 'other'}
      ];
    },
    defaultPurpose() {
      const saved = this.savedByCandidateIdState ? this.savedByCandidateIdState[this.candidateId] : {};
      let defaultPurposeType = 'interest';

      if (this.featureSwitchesState.SHORTLISTED_CANDIDATES && saved && saved.is_sourced) {
        defaultPurposeType = saved.is_sourced ? 'interview' : 'interest';
      }

      return this.purposes.find(purpose => {
        return purpose.type === (this.selectedPurposeType || defaultPurposeType);
      });
    },
    defaultProject() {
      const project = this.projectsByCandidateIdState[this.candidateId];
      return project && project.status !== 'archived' ? this.getProjectWithDispalyedTitle(project) : null;
    },
    labels() {
      return {
        project: this.$gettext('Project'),
        purpose: this.$gettext('Purpose'),
        message: this.$gettext('Message'),
        phone: this.$gettext('Phone'),
        address: this.$gettext('Address'),
        interviewDate: this.$gettext('Interview Date'),
        time: this.$gettext('Time'),
        selectProject: this.$gettext('Select a project')
      };
    },
    dayNamesTranslated() {
      return translated.getDayNamesTranslated(this);
    },
    monthNamesTranslated() {
      return translated.getMonthNamesTranslated(this);
    },
    unarchivedProjects() {
      return this.$archive.getUnarchivedProjects();
    },
    projectsList() {
      const list = [];
      forEach(this.unarchivedProjects, project => {
        if (project.type !== 'pipeline') {
          list.push(this.getProjectWithDispalyedTitle(project));
        }
      });
      return list;
    },
    initialData() {
      return {
        project_id: this.defaultProject ? this.defaultProject.id : null,
        purpose: this.defaultPurpose.title,
        phone_number: this.userDetailsState.phone,
        date: null,
        time: {HH: '00', mm: '00'}
      };
    }
  },
  methods: {
    getProjectWithDispalyedTitle(project) {
      return {...project, displayedTitle: projects.getProjectDisplayTitle(project, this)};
    },
    beforeOpen() {
      this.$store.commit('clearFieldsInterestedFormState');
      this.$store.commit('mutateFieldsInterestedFormState', this.initialData);
      const payload = {
        candidate_id: this.candidateId,
        purpose: this.defaultPurpose.title,
        project_id: this.initialData.project_id
      };
      this.$store.dispatch('contactCandidateAction', payload).then(() => {
        this.$emit('post-contact');
        if (this.$route.params.code) {
          this.$store.dispatch('fetchCandidateInBackgroundAction', {code: this.$route.params.code});
          this.$store.dispatch('fetchContactedCandidatesInBackground');
        }
      });
    },
    beforeClose() {
      this.$mam.trackContactCandidateClosed();
    },
    formatDate(date) {
      const locale = this.$language.isChinese() ? 'zh-Hans' : 'en-US';
      return `${date.getDate()} ${date.toLocaleDateString(locale, {
        month: 'long'
      })} ${date.getFullYear()}`;
    },
    getFieldType(field) {
      const error = this.interestedFormState.error;
      return error && error[field] ? 'is-danger' : '';
    },
    getErrorMessage(field) {
      const error = this.interestedFormState.error;
      return error && error[field] ? error[field].join(' ') : '';
    },
    getValidFormFields() {
      const {time, date, ...fields} = {...this.interestedFormState.fields};
      fields.phone_number = this.showPhoneField ? fields.phone_number : null;
      fields.interview_address = this.showAddressField ? fields.interview_address : null;
      fields.interview_time =
        this.showInterviewField && date
          ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${time}Z`
          : null;
      return pickBy(fields, value => {
        return value !== null;
      });
    },
    updateContactedCandidate() {
      const data = this.getValidFormFields();
      this.$store.dispatch('changeContactedCandidateAction', {id: this.candidateId, data}).then(response => {
        this.hideModal();
        const date = moment(response.interview_time)
          .utc()
          .format('MMM D, YYYY');
        const time = moment(response.interview_time)
          .utc()
          .format('hh:mmA');
        this.$mam.trackContactCandidateUpdateRequest(
          response.candidate.title,
          this.savedToAccountActiveProjectsByCandidateIdState[this.candidateId],
          response.candidate.city_name,
          this.projectsByCandidateIdState[this.candidateId],
          response.purpose,
          response.message,
          date,
          time,
          response.interview_address
        );
        this.$toast.open({message: this.$gettext('Request updated'), type: 'is-success'});
      });
    },
    handleChangeProject(project) {
      this.$store.commit('mutateFieldsInterestedFormState', {project_id: project.id});
    },
    handleChangeField(value) {
      this.changeFieldValue(value.target.name, value.target.value);
    },
    handleDatePick(datetime) {
      this.changeFieldValue('date', datetime);
    },
    handleTimePick(time) {
      this.changeFieldValue('time', `${time.data.HH}:${time.data.mm}`);
    },
    handleChangePurpose(purpose) {
      this.changeFieldValue('purpose', purpose.title);
      this.selectedPurposeType = purpose.type;
    },
    handleChangeStatus(status) {
      this.changeFieldValue('status', status.type);
    },
    changeFieldValue(fieldName, value) {
      this.$store.commit('mutateFieldsInterestedFormState', {[fieldName]: value});
    },
    hideModal() {
      this.$modal.hide(this.modalName);
    }
  },
  components: {MultiselectField, InputField, TimepickerInput, DatepickerInput, ContactDescription, ModalDialog}
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.interested-popup-container {
  max-height: calc(100vh);
  overflow: auto;
  padding: 25px 20px;
  /deep/ .field:last-of-type {
    margin-bottom: 15px;
  }
  h3 {
    margin-bottom: 10px;
  }
  .flex-box {
    display: flex;
  }
  /deep/ .projects-select-field {
    margin-bottom: 15px;
  }
  /deep/ .time-picker .dropdown {
    top: auto;
    bottom: 100%;
  }
  .field {
    &.date {
      width: 200px;
      margin-right: 20px;
    }
    &.time {
      width: 90px;
      & /deep/ .display-time {
        border-radius: 3px;
        border: solid 1px $mid-gray;
        height: 36px;
        &:focus {
          border: solid 2px $icons;
        }
      }
    }
    &.phone {
      width: 147px;
    }
    & /deep/ .text-area textarea.textarea {
      height: 80px;
      resize: none;
      box-shadow: none;
    }
  }
  a.is-accent-default {
    margin-top: 12px;
  }
  & /deep/ .time-picker li.active {
    background: $secondary;
    &:hover {
      background: $secondary;
    }
  }
  .controls {
    margin-top: 25px;
  }
}
</style>
