import store from '../../store';

export default function registrationSubmittedGuard(to, from, next) {
  if (!store.state.auth.justRegistered) {
    next(false);
    return;
  }
  next();
}
