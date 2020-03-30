<template>
  <pipeliner-candidate-profile v-if="$store.getters.isFeatureOn('PIPELINER') && candidate && candidate.is_pipeliner"
                               :candidate="candidateState"
                               :contacted="contacted"
                               :loading="loading"
                               :errors="error">
  </pipeliner-candidate-profile>
  <candidate-profile v-else
                     :candidate="candidateState"
                     :contacted="contacted"
                     :loading="loading"
                     :errors="error">
  </candidate-profile>
</template>

<script>

import {isEmpty} from 'lodash';
import auth from 'top20common/distribution/services/auth';
import {mapActions, mapGetters} from 'vuex';

import CandidateProfile from '@/pages/profile/CandidateProfile';
import PipelinerCandidateProfile from '@/pages/profile/pipeliner/PipelinerCandidateProfile';
import * as constants from '@/store/constants';
import {FETCH_UNLOCKED_CANDIDATES} from '@/store/modules/unlocked-candidates/constants';

export default {
  mounted() {
    this.$store
      .dispatch('fetchCandidateDetailsViewAction', this.$route.params.code)
      .then(() => {
        this.reviewSaved(); // duplicated call to review saved no matter which request will execute first
      })
      .catch(error => {
        if (error && error.NotFound) {
          this.$mam.track404();
        }
      });

    if (this.$store.getters[constants.IS_USER_ACCOUNT_APPROVED]) {
      this.$store.dispatch('fetchContactedCandidatesAction');
    }

    this.$store.dispatch(isEmpty(this.allProjectsState) ? 'fetchProjectsAction' : 'fetchProjectsInBackgroundAction');
    this.$store.dispatch(constants.FETCH_SAVED_CANDIDATES_LIST_REQUEST).then(() => {
      this.reviewSaved(); // duplicated call to review saved no matter which request will execute first
    });
    this.$store.dispatch(FETCH_UNLOCKED_CANDIDATES);
    this.$store.dispatch('fetchFiltersAction');

    if (this.candidate) {
      this.setProfileTitle(this.candidate.title);
    }
  },
  beforeDestroy() {
    /* After unmount we need to clear from store prev candidate */
    this[constants.CLEAR_CANDIDATE]();
  },
  watch: {
    candidate() {
      this.setProfileTitle(this.candidate.title);
    }
  },
  computed: {
    ...mapGetters([
      'allProjectsState',
      'savedByCandidateIdState',
      'savedToAccountActiveProjectsByCandidateIdState',
      'contactedToAccountActiveProjectsByCandidateIdState'
    ]),
    candidate() {
      return this.$store.getters.getCandidateState.candidate;
    },
    contacted() {
      return Boolean(this.candidate && this.contactedToAccountActiveProjectsByCandidateIdState[this.candidate.id]);
    },
    error() {
      return this.$store.getters.getCandidateState.error;
    },
    loading() {
      return this.$store.getters.getCandidateState.loading;
    },
    candidateFromCandidatesList() {
      const candidates = this.$store.getters.getCandidates;
      if (candidates) {
        return candidates.find(candidate => {
          return candidate.code && candidate.code.toLowerCase() === this.$route.params.code;
        });
      }
    },
    candidateState() {
      return this.candidate || this.candidateFromCandidatesList;
    }
  },
  methods: {
    ...mapActions([constants.CLEAR_CANDIDATE]),
    setProfileTitle(title) {
      const website =
        process.env.VUE_APP_IS_O2O === 'true' ? this.$gettext('CGP O2O powered by Top20Talent') : 'Top20Talent';
      document.title = `${title.replace(/\b\w/g, l => l.toUpperCase())} - ${website}`;
    },
    reviewSaved() {
      if (
        this.candidate &&
        this.savedByCandidateIdState[this.candidate.id] &&
        this.savedByCandidateIdState[this.candidate.id].need_review &&
        !auth.isImpersonator()
      )
        this.$store.dispatch('updateSavedCandidateInBackgroundAction', {
          candidate_id: this.candidate.id,
          need_review: false
        });
    }
  },
  components: {
    CandidateProfile,
    PipelinerCandidateProfile
  },
  $style: null
};
</script>
