import fileSaver from 'file-saver';
import {
  getAllNichesApi,
} from '../../api/pbn/niches';

import {
  createPbnApi,
  uploadPbnFileApi,
  updatePbnApi,
  deletePbnMultipleApi,
  deletePbnSingleApi,
  getPbnListApi,
  exportToFileApi,
  getPbnListByIdCollectionApi,
} from '../../api/pbn/pbn';

export default {
  getAllNiches({ commit }) {
    return new Promise((resolve, reject) => {
      getAllNichesApi()
        .then((response) => {
          commit('saveNiches', response);
          resolve(response);
        })
        .catch((errors) => {
          reject(errors);
        });
    });
  },
  createPbn(context, formData) {
    return new Promise((resolve, reject) => {
      const data = {
        niche: formData.nicheId,
        url: formData.url,
        obl_num: formData.totalObl,
        rd: { value: +formData.rd },
        da: { value: +formData.da },
        pa: { value: +formData.pa },
        tf: { value: +formData.tf },
        logins: formData.logins,
        login_url: formData.login_url,
      };

      createPbnApi(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  uploadPbnFile(context, file) {
    return new Promise((resolve, reject) => {
      uploadPbnFileApi(file)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  updatePbn({ dispatch }, pbn) {
    return new Promise((resolve, reject) => {
      const data = {
        id: pbn.id || null,
        niche: pbn.niche.id ? pbn.niche.id : pbn.niche,
        url: pbn.url,
        obl_num: pbn.obl_num,
        rd: { value: pbn.rd.value ? +pbn.rd.value : +pbn.rd },
        da: { value: pbn.da.value ? +pbn.da.value : +pbn.da },
        pa: { value: pbn.pa.value ? +pbn.pa.value : +pbn.pa },
        tf: { value: pbn.tf.value ? +pbn.tf.value : +pbn.tf },
        logins: pbn.logins,
        login_url: pbn.login_url,
      };
      updatePbnApi(data)
        .then((response) => {
          dispatch('getPbnList');
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deletePbnMultiple({ state, dispatch, commit }) {
    return new Promise((resolve, reject) => {
      const params = {
        id: state.selectedPbn.join(','),
      };
      deletePbnMultipleApi(params)
        .then((response) => {
          commit('clearSelectedPbnState');
          dispatch('getPbnList');
          resolve(response);
        })
        .catch(() => {
          commit('clearSelectedPbnState');
          reject();
        });
    });
  },
  deletePbnSingle({ dispatch, commit }, id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return;
      }
      deletePbnSingleApi(id)
        .then((response) => {
          commit('clearSelectedPbnState');
          dispatch('getPbnList');
          resolve(response);
        })
        .catch(() => {
          commit('clearSelectedPbnState');
          reject();
        });
    });
  },
  getPbnList({ commit, state }) {
    return new Promise((resolve, reject) => {
      const requestQueryParams = {
        page: state.pbnLinksPagination.page,
      };
      Object.keys(state.pbnLinksQueryParams).forEach((key) => {
        if (state.pbnLinksQueryParams[key]) {
          requestQueryParams[key] = state.pbnLinksQueryParams[key];
        } else {
          state.pbnLinksQueryParams[key] = '';
        }
      });

      getPbnListApi(requestQueryParams)
        .then((data) => {
          commit('setPbnLinksCollectionState', data.results);
          commit('setPbnLinksPaginationState', data);
          resolve(requestQueryParams);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getPbnListByIdCollection({ state }) {
    return new Promise((resolve, reject) => {
      const params = {
        id: state.selectedPbn.join(','),
      };
      getPbnListByIdCollectionApi(params)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  exportToFile({ state }) {
    return new Promise((resolve, reject) => {
      const params = {
        id: state.selectedPbn.join(','),
        format: 'csv',
      };
      exportToFileApi(params)
        .then(async (data) => {
          await fileSaver(data, `pbn_export_${new Date().valueOf()}.csv`);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
