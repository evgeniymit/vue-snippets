import { USER_ROLE_TYPES } from '../api/auth';

export default {
  methods: {
    resolveInitRouteName(role) {
      switch (role) {
        case USER_ROLE_TYPES.INVENTORY:
          return 'inventory-home';
        case USER_ROLE_TYPES.FULFILLMENT:
          return 'fulfillment-home';
        case USER_ROLE_TYPES.PERSONNEL:
          return 'personnel-home';
        default:
          return 'personnel-home';
      }
    },
  },
};
