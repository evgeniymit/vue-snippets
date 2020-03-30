<template>
  <v-app-bar v-if="!loggedIn" app>
    <v-toolbar-title>
      <span class="ml-5 logo subtitle-1">Jarvis</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <router-link :to="{ name: 'sign-in' }">
      <v-btn class="text-uppercase" text>Sign In</v-btn>
    </router-link>
    <!--<router-link class="ml-3" :to="{ name: 'register' }">
      <v-btn class="text-uppercase" text>Sign Up</v-btn>
    </router-link>-->
  </v-app-bar>
</template>

<script>
export default {
  name: 'AuthHeader',
  computed: {
    loggedIn() {
      return this.$store.getters['auth/loggedIn'];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/variables.scss";

.logo {
  color: $primary;
  font-weight: 500;
}
</style>
