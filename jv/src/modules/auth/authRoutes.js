import SignIn from './views/SignIn.vue';
// eslint-disable-next-line import/no-cycle
import registrationSubmittedGuard from '@/router/guards/registrationSubmittedGuard';

const routes = [
  {
    path: 'sign-in',
    name: 'sign-in',
    component: SignIn,
  },
  /*
    {
      path: 'sign-up',
      name: 'register',
      component: () => import('./views/SignUp.vue'),
    },
  */
  {
    path: 'registered',
    name: 'registered',
    replace: true,
    beforeEnter: registrationSubmittedGuard,
    component: () => import('./views/RegistrationSubmitted.vue'),
  },
  {
    path: 'reset-password',
    name: 'reset-password',
    component: () => import('./views/ResetPassword.vue'),
  },
  {
    path: 'reset-password/:uid/:token',
    name: 'new-password',
    component: () => import('./views/SetNewPassword.vue'),
  },
  {
    path: 'activate/:uid/:token',
    name: 'activate-new-user',
    component: () => import('./views/ActivateNewUser.vue'),
  },
];

export default routes.map(route => Object.assign({}, route));
