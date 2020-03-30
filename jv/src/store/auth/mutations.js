export default {
  setRegistrationData(state) {
    state.justRegistered = true;
  },
  login(state, response) {
    state.loggedIn = true;
    state.token = response.token;
    state.auth = response;
  },
  logout(state) {
    state.loggedIn = false;
    state.token = '';
  },
  setBasicUser(state, user) {
    state.user = user;
  },
};
