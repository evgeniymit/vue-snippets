import { USER_ROLE_TYPES } from '@/api/auth';

export default {
  loggedIn: state => state.loggedIn,
  userRole: state => (state.user.role ? state.user.role : null),
  justRegistered: state => (
    state && state.justRegistered ? state.justRegistered : false
  ),
  userFullName: state => (state.user ? `${state.user.first_name} ${state.user.last_name}` : ''),
  isFulfillmentManager: state => state.user.role === USER_ROLE_TYPES.FULFILLMENT,
};
