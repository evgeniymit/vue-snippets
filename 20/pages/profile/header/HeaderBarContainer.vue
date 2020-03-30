<template>
  <header-bar
    :candidate="candidate"
    :contacted="contacted"
    :loadingForContactedCandidatesList="loadingForContactedCandidatesList"
    :cvUrl="cvUrl"
    :loadingForCandidateDetail="loadingForCandidateDetail"
    :unlockedCandidatesLoading="unlockedCandidatesLoading"
    :isUserAccountApproved="isUserAccountApproved"
    :unlockCVHandler="unlockCVHandler"
    :cvUnlockedCallback="cvUnlockedCallback"
    :project="project">
  </header-bar>
</template>

<script>

import {mapGetters} from 'vuex';

import HeaderBar from '@/pages/profile/header/HeaderBar';
import {IS_USER_ACCOUNT_APPROVED} from '@/store/constants';
import {GET_UNLOCKED_CANDIDATES_LOADING, UNLOCK_CV} from '@/store/modules/unlocked-candidates/constants';

export default {
  props: {
    candidate: Object,
    contacted: Boolean,
    loadingForCandidateDetail: Boolean
  },
  computed: {
    ...mapGetters({
      isUserAccountApproved: IS_USER_ACCOUNT_APPROVED,
      unlockedCandidates: 'unlockedCandidatesState',
      projectsByCandidateIdState: 'projectsByCandidateIdState',
      savedToAccountActiveProjectsByCandidateIdState: 'savedToAccountActiveProjectsByCandidateIdState'
    }),
    project() {
      return this.projectsByCandidateIdState[this.candidate && this.candidate.id];
    },
    loadingForContactedCandidatesList() {
      return this.$store.getters.contactedCandidatesState.loading;
    },
    unlockedCandidatesLoading() {
      return this.$store.getters[GET_UNLOCKED_CANDIDATES_LOADING] || !this.unlockedCandidates;
    },
    cvUrl() {
      if (this.candidate) {
        if (this.candidate.cv_url) {
          return this.candidate.cv_url;
        } else if (this.unlockedCandidates) {
          return this.unlockedCandidates[this.candidate.id];
        }
      }
    }
  },
  methods: {
    unlockCVHandler() {
      this.$store
        .dispatch(UNLOCK_CV, this.candidate.id)
        .then(() => {
          this.cvUnlockedCallback();
          this.$mam.trackUnlockCvClick(
            this.candidate.title,
            this.savedToAccountActiveProjectsByCandidateIdState[this.candidate.id],
            this.candidate.city_name,
            this.project
          );
        })
        .catch(error => {
          this.$toast.open({
            message: error,
            type: 'is-danger'
          });
        });
    },
    cvUnlockedCallback() {
      if (this.isUserAccountApproved) {
        this.$store.dispatch('fetchCandidateInBackgroundAction', {code: this.$route.params.code});
        this.$toast.open({
          message: this.$gettext('CV unlocked'),
          type: 'is-success'
        });
      }
    }
  },
  components: {HeaderBar}
};
</script>
