export default {
  justRegistered: false,
  loggedIn: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || '',
  user: {},
  auth: {},
};
