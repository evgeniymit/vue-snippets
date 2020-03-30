import rankClubAPI from '../api/http';

export default {
  created() {
    rankClubAPI.interceptors.response.use(undefined, (error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        this.$store.commit('auth/logout');
        localStorage.clear();
        this.$router.push('/auth/sign-in').catch(e => e);
      }
      return Promise.reject(error);
    });
  },
};
