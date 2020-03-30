<template>
  <div class="page">
    <h1 class="title text-center">Thank you for the registration!</h1>
    <p class="text-center">
      We will send a confirmation email in a while
    </p>
  </div>
</template>

<script>
export default {
  name: 'RegistrationSubmitted',
};
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/variables';

.page {
  padding-top: 150px;
  margin: auto;
}
h1 {
  color: $primary;
}
</style>
