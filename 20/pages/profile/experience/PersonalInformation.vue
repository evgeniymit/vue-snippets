<template>
  <section>
    <div class="person-info" v-if="hasPersonalInfo()">
      <h3 class="heading-3 person-info-header" v-translate>Personal Information</h3>
      <div>
        <p v-if="candidate.full_name">
          <span class="paragraph-bold" v-translate>Name:</span><span>&nbsp;</span>
          <span>{{ candidate.full_name }}</span>
        </p>
        <p v-if="candidate.email">
          <span class="paragraph-bold" v-translate>Email:</span><span>&nbsp;</span>
          <span>{{ candidate.email }}</span>
        </p>
        <p v-if="candidate.phone_number">
          <span class="paragraph-bold" v-translate>Telephone:</span><span>&nbsp;</span>
          <span>{{ getPhoneNumber() }}</span>
        </p>
        <p v-if="candidate.marital_status">
          <span class="paragraph-bold" v-translate>Marital status:</span><span>&nbsp;</span>
          <span>{{ candidate.marital_status }}</span>
        </p>
        <p v-if="candidate.gender">
          <span class="paragraph-bold" v-translate>Gender:</span><span>&nbsp;</span>
          <span>{{ candidate.gender }}</span>
        </p>
        <p v-if="candidate.birth_date">
          <span class="paragraph-bold" v-translate>Age:</span><span>&nbsp;</span>
          <span>{{ candidate.birth_date | moment('from', 'now', true) }} ({{ candidate.birth_date }})</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    candidate: Object
  },
  methods: {
    hasPersonalInfo() {
      return (
        this.candidate &&
        (this.candidate.full_name ||
          this.candidate.email ||
          this.candidate.marital_status ||
          this.candidate.gender ||
          this.candidate.birth_date)
      );
    },
    getPhoneNumber() {
      if (this.candidate.phone_number) {
        return this.candidate.phone_number.replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.person-info {
  div {
    margin-bottom: 20px;
  }
  h3 {
    text-align: left;

    &.person-info-header {
      display: inline-block;
      margin: 10px 0 30px;
    }
  }
}
</style>
