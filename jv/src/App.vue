<template>
  <v-app class="rank-club-app">
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  created() {
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
    }, false);
    window.addEventListener('drop', (e) => {
      e.preventDefault();
    }, false);
  },
};
</script>
