<template>
  <div>
    <div class="edit-list is-capitalized">
      <div class="edit-item is-capitalized">
        <p class="paragraph-s">
          <span v-translate>Code:</span><span>&nbsp;</span>
          <span>{{ candidate && candidate.code ? candidate.code : '' }}</span>
        </p>
        <p class="paragraph-s">
          <span v-translate>Status:</span><span>&nbsp;</span>
          <span :class="candidateStatus">{{ candidateStatus }}</span>
        </p>
        <p v-if="candidate && candidate.consultant_name" class="paragraph-s">
          <span v-translate>Consultant:</span><span>&nbsp;</span>
          <a :href="getConsultantEmail()" class="primary-link">{{ candidate.consultant_name }}</a>
        </p>
        <div v-if="user.is_staff" class="admin-button-box">
          <a v-translate :href="adminUrl" class="button is-accent-default" target="_blank">
            Edit
          </a>
        </div>
        <div v-if="candidate && candidate.external_id" class="admin-button-box">
          <a :href="candidate.external_url" class="button is-accent-default" target="_blank">
            {{ externalLinkTitle }}
          </a>
        </div>
        <div v-if="candidate && candidate.cv_url" class="admin-button-box">
          <a v-translate :href="candidate.cv_url" class="button is-accent-default" target="_blank">
            Download Top20 CV
          </a>
        </div>
        <div v-if="candidate && candidate.resume_file" class="admin-button-box">
          <a v-translate :href="candidate.resume_file" class="button is-accent-default" target="_blank">
            Download Original CV
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import userInfo from 'top20common/distribution/mixins/userInfo';
export default {
  mixins: [userInfo],
  props: {
    candidate: Object
  },
  data() {
    return {
      siteNameBySource: {
        CGP: 'Invenias',
        eHire: 'eHire'
      }
    };
  },
  computed: {
    adminUrl() {
      return this.candidate && this.candidate.id ? '/admin/candidates/candidate/' + this.candidate.id + '/change/' : '';
    },
    externalLinkTitle() {
      const helpText = this.$gettext('Open in %{site_name}');
      return this.$gettextInterpolate(helpText, {site_name: this.siteNameBySource[this.candidate.source]});
    },
    candidateStatus() {
      return this.candidate && this.candidate.status ? this.candidate.status : ''
    }
  },
  methods: {
    getConsultantEmail() {
      return `mailto:${this.candidate.consultant_email}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';
@import '~CommonStyles/pipeliner.scss';

.active {
  color: $success
}

.internal {
  color: $black
}

.invalid {
  color: $black
}

.frozen {
  color: $blue
}

.incomplete {
  color: $error
}

.pending {
  color: $secondary
}

.duplicate {
  color: $black
}

.abandoned {
  color: $error
}

.pipeline {
  color: $pipeliner-blue
}

.edit-item {
  margin-top: 11.5px;
  margin-bottom: 12px;
  a.button {
    width: initial;
  }
}

.admin-button-box {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
