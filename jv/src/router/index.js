import Vue from 'vue';
import Router from 'vue-router';
import authenticationGuard from './guards/authenticationGuard';

import authRoutes from '../modules/auth/authRoutes';
import fulfillmentPersonnelRoutes from '../modules/fulfillment-personnel/fulfillmentPersonnelRoutes';
import fulfillmentManagerRoutes from '../modules/fulfillment-manager/fulfillmentManagerRoutes';
import inventoryManagerRoutes from '../modules/inventory-manager/inventoryManagerRoutes';

Vue.use(Router);

const routes = [
  {
    path: '/auth',
    name: 'auth-container',
    component: () => import('../modules/auth/views/AuthContainer.vue'),
    children: [
      ...authRoutes,
    ],
    meta: {
      guestOnly: true,
    },
  },
  ...fulfillmentPersonnelRoutes,
  ...fulfillmentManagerRoutes,
  ...inventoryManagerRoutes,
  {
    path: '*',
    redirect: '/auth/sign-in',
  },
];
const router = new Router({ routes });
router.beforeEach(authenticationGuard);

export default router;
