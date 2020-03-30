<template>
  <div id="auth-container" class="content">
    <AuthHeader />
    <router-view />
  </div>
</template>

<script>
import AuthHeader from './AuthHeader.vue';

export default {
  name: 'AuthContainer',
  components: {
    AuthHeader,
  },
};
</script>

<style lang="scss" scoped>
  .content {
    min-height: 100vh;
  }
</style>

<style>
#auth-container main.v-content {
  height: 100vh;
}
</style>
