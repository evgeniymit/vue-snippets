import store from '../../store';
import resolveInitRouteByRole from '../../mixins/resolveInitRouteByRole';

function proceed(to, next, role) {
  if (to.matched.some(record => record.meta.role === role)) {
    next();
    return;
  }
  next({
    name: resolveInitRouteByRole.methods.resolveInitRouteName(role),
    replace: true,
  });
}

function dispatchGetUserInfo(to, next) {
  store.dispatch('auth/getUserInfo')
    .catch((error) => {
      if (+error.status === 401) {
        next({ name: 'sign-in' });
      }
    });
  /*
    Watch for the user to be loaded. When it's finished, then
    we proceed.
  */
  store.watch(
    (state, getters) => getters['auth/userRole'],
    (newValue) => {
      if (newValue) {
        proceed(to, next, newValue);
      }
    },
  );
}

export default (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = store.getters['auth/loggedIn'];
  const isUserInfoAvailable = !!store.getters['auth/userRole'];

  if (isLoggedIn && !isUserInfoAvailable) {
    dispatchGetUserInfo(to, next);
    return;
  }
  if (isLoggedIn && requiresAuth) {
    if (isUserInfoAvailable) {
      proceed(to, next, store.getters['auth/userRole']);
    }
    return;
  }
  if (!isLoggedIn && requiresAuth) {
    next({ name: 'sign-in', replace: true });
    return;
  }
  if (to.matched.some(record => record.meta.guestOnly && isLoggedIn)) {
    next(false);
    return;
  }
  next();
};
