<template>
  <div v-if="featureSwitchesState.RM_TOOLS_PERMANENT && candidate && contacted" class="admin-button-box">
    <button class="button is-light is-rounded paragraph-s" @click="openEditPopup">🔑 {{ titleEditPipeline }}</button>
    <edit-pipeline-status-popup-container
      :candidateId="candidate.id"
      :contacted="contacted"
      :meta="contactedCandidatesState.meta"
      modalName="edit-pipeline-status-popup-container">
    </edit-pipeline-status-popup-container>
  </div>
</template>
<script>

import {mapGetters} from 'vuex';

import EditPipelineStatusPopupContainer from '@/pages/profile/aside-blocks/popups/EditPipelineStatusPopupContainer';

export default {
  props: {
    candidate: Object
  },
  computed: {
    ...mapGetters([
      'featureSwitchesState',
      'contactedCandidatesState',
      'contactedToAvailableActiveProjectsByCandidateIdState'
    ]),
    titleEditPipeline() {
      return this.$gettext('Edit');
    },
    contacted() {
      return this.contactedToAvailableActiveProjectsByCandidateIdState[this.candidate.id];
    }
  },
  methods: {
    openEditPopup() {
      this.$modal.show('edit-pipeline-status-popup-container');
    }
  },
  components: {EditPipelineStatusPopupContainer}
};
</script>
<style scoped lang='scss'>
@import '~VariablesStyles';

.admin-button-box {
  margin-top: 5px;
}
</style>
