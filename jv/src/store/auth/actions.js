import {
  activateNewUserApi,
  restorePasswordApi,
  setNewPasswordApi,
  signInApi,
  signOutApi,
  signUpApi,
  getUserInfoApi,
} from '../../api/auth';

export default {
  signIn({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      signInApi(data)
        .then((response) => {
          commit('login', response);
          localStorage.setItem('token', response.token);
          dispatch('getUserInfo');
          resolve(response);
        })
        .catch((errors) => {
          commit('logout');
          localStorage.removeItem('token');
          reject(errors);
        });
    });
  },
  signOut({ commit }) {
    return new Promise((resolve, reject) => {
      signOutApi()
        .then(() => {
          commit('logout');
          commit('fulfillmentManager/cleanUp', undefined, { root: true });
          localStorage.clear();
          resolve();
        })
        .catch((error) => {
          commit('logout');
          commit('fulfillmentManager/cleanUp', undefined, { root: true });
          localStorage.clear();
          reject(error);
        });
    });
  },
  signUp({ commit }, data) {
    commit('setRegistrationData');
    return new Promise((resolve, reject) => {
      signUpApi(data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },
  activateNewUser({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      activateNewUserApi(data)
        .then((response) => {
          commit('login', response);
          localStorage.setItem('token', response.token);
          dispatch('getUserInfo');
          resolve(response);
        })
        .catch((error) => {
          commit('logout');
          localStorage.removeItem('token');
          reject(error);
        });
    });
  },
  requestPasswordReset(context, email) {
    return new Promise((resolve, reject) => {
      restorePasswordApi(email)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  setNewPassword(context, data) {
    return new Promise((resolve, reject) => {
      setNewPasswordApi(data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfoApi()
        .then((response) => {
          commit('setBasicUser', response);
          resolve(response);
        })
        .catch((error) => {
          commit('logout');
          reject(error);
        });
    });
  },
};
