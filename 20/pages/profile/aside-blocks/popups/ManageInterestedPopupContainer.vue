<script>

import moment from 'moment';

import InterestedPopupContainer from '../../header/interested/InterestedPopupContainer';

export default {
  extends: InterestedPopupContainer,
  props: {
    contacted: Object
  },

  mounted: function() {
    this.handleChangePurpose(this.defaultPurpose);
  },
  computed: {
    description() {
      return null;
    },
    initialData() {
      return {
        project_id: this.defaultProject ? this.defaultProject.id : null,
        purpose: this.defaultPurpose.title || null,
        phone_number: this.contacted.phone_number,
        date: this.date,
        time: this.time,
        message: this.contacted.message,
        interview_address: this.contacted.interview_address
      };
    },
    defaultPurpose() {
      return this.purposes.find(purpose => {
        return purpose.title === this.contacted.purpose;
      });
    },
    date() {
      if (this.contacted.interview_time) {
        return new Date(this.contacted.interview_time);
      }
      return null;
    },
    time() {
      if (this.date) {
        return {
          HH: moment(this.date)
            .utc()
            .format('HH'),
          mm: moment(this.date)
            .utc()
            .format('mm')
        };
      }
      return {HH: '00', mm: '00'};
    }
  },
  methods: {
    beforeOpen() {
      this.$store.commit('clearFieldsInterestedFormState');
      this.$store.commit('mutateFieldsInterestedFormState', this.initialData);
      this.selectedPurposeType = this.defaultPurpose.type;
    },

    updateContactedCandidate() {
      const data = this.getValidFormFields();
      this.$store.dispatch('changeContactedCandidateManageAction', {id: this.contacted.id, data}).then(response => {
        this.hideModal();

        this.$toast.open({message: this.$gettext('Request updated'), type: 'is-success'});
      });
    }
  }
};
</script>
