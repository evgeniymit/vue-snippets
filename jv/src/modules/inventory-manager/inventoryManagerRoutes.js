import { USER_ROLE_TYPES } from '../../api/auth';

export default [
  {
    path: '/inventory-manager',
    name: 'inventory-parent',
    component: () => import('./views/HomeView.vue'),
    meta: {
      requiresAuth: true,
      isAdmin: false,
      role: USER_ROLE_TYPES.INVENTORY,
    },
    redirect: { name: 'inventory-home' },
    children: [
      {
        path: 'summary',
        name: 'inventory-home',
        component: () => import('./views/SummaryView.vue'),
      },
      {
        path: 'statistics',
        name: 'inventory-statistics',
        component: () => import('./views/StatisticsView.vue'),
      },
      {
        path: 'pbn-obls/:pbnId',
        name: 'inventory-pbn-obls',
        component: () => import('./views/PbnOblsView.vue'),
      },
    ],
  },
];
