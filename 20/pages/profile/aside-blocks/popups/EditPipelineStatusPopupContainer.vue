<template>
  <manage-interested-popup-container
    :modalName="modalName"
    :candidateId="candidateId"
    :contacted="contacted"
    :conditionalFields="false"
  >
    <h3 v-translate slot="heading" class="heading-3">Edit pipeline</h3>
    <b-field :label="labels.status" slot-scope="props">
      <multiselect-field
        :options="statusOptions"
        :value="currentStatus"
        :iconField="false"
        :close-on-select="true"
        :hide-selected="true"
        :searchable="false"
        :isPositionFixed="true"
        track-by="type"
        label="title"
        @input="props.handleChangeStatus"
      >

      </multiselect-field>
    </b-field>

    <template slot="client-message" slot-scope="props">
      <b-field :label="labels.clientMessage">
        <b-input
          :value="contacted.client_message"
          name="client_message"
          type="textarea"
          class="text-area"
          @input.native="props.handleChangeField"
        ></b-input>
      </b-field>
    </template>

  </manage-interested-popup-container>
</template>
<script>

import BField from 'buefy/src/components/field/Field';
import InputField from 'top20common/components/InputField';
import MultiselectField from 'top20common/components/MultiselectField';

import ManageInterestedPopupContainer from './ManageInterestedPopupContainer';

export default {
  props: {
    candidateId: String,
    modalName: String,
    meta: Object,
    contacted: Object
  },
  computed: {
    labels() {
      return {
        status: '🔑 ' + this.$gettext('Status'),
        clientMessage: '🔑 ' + this.$gettext('Client Message')
      };
    },
    statusOptions() {
      let options = [];
      for (let key of Object.keys(this.meta.statuses)) {
        options.push(this.getOptionItem(key));
      }
      return options;
    },
    currentStatus() {
      for (let key of Object.keys(this.meta.statuses)) {
        if (key === this.contacted.status) {
          return this.getOptionItem(key);
        }
      }
    }
  },
  methods: {
    getOptionItem(key) {
      return {title: this.meta.statuses[key].status, type: key};
    }
  },
  components: {
    MultiselectField,
    InputField,
    BField,
    ManageInterestedPopupContainer
  }
};
</script>
