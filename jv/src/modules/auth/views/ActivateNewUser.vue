<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-progress-circular
          indeterminate
          :size="100"
          :width="6"
          color="light-blue"
        />
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import resolveInitRouteByRole from '@/mixins/resolveInitRouteByRole';

export default {
  name: 'ActivateNewUser',
  mixins: [resolveInitRouteByRole],
  created() {
    this.$store.dispatch('auth/activateNewUser', this.$route.params)
      .then((response) => {
        const routeName = this.resolveInitRouteName(response.role);
        this.$router.push({ name: routeName });
      })
      .catch(() => {
        this.$router.push({ name: 'sign-in' });
      });
  },
};
</script>
