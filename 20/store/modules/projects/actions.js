import CandidatesService from 'top20common/distribution/services/candidates';

import utils from '@/services/utils';

export default {
  clearNewProjectAction(context) {
    context.commit('clearNewProjectState');
  },
  createProjectAction(context, options) {
    context.commit('mutateProjectFormState', {loading: true});
    return new Promise((resolve, reject) => {
      const formData = utils.getFormData(options);
      CandidatesService.createProject(formData)
        .then(response => {
          context.commit('addToAllProjectsState', response.data);
          context.commit('mutateNewProjectState', response.data.id);
          context.commit('mutateProjectFormState', {loading: false});
          resolve(response.data);
        })
        .catch(error => {
          context.commit('mutateProjectFormState', {errors: error.response.data.errors, loading: false});
        });
    });
  },
  editProjectAction(context, {id, options}) {
    context.commit('mutateEachProjectLoadingState', {id, value: true});
    context.commit('mutateProjectFormState', {loading: true});
    return new Promise((resolve, reject) => {
      const formData = utils.getFormData(options);
      CandidatesService.editProject(id, formData)
        .then(response => {
          context.commit('mutateEachProjectLoadingState', {id, value: false});
          context.commit('changeProjectInAllProjectsState', response.data);
          context.commit('mutateProjectFormState', {loading: false});
          return resolve(response);
        })
        .catch(error => {
          context.commit('mutateEachProjectLoadingState', {id, value: false});
          context.commit('changeProjectsErrorState', error.response.data.errors);
          context.commit('mutateProjectFormState', {errors: error.response.data.errors, loading: false});
        });
    });
  },
  deleteProjectAction(context, id) {
    context.commit('mutateEachProjectLoadingState', {id, value: true});
    return new Promise((resolve, reject) => {
      CandidatesService.editProject(id, {status: 'deleted'})
        .then(response => {
          context.commit('mutateEachProjectLoadingState', {id, value: false});
          context.commit('deleteProjectInAllProjectsState', response.data);
          context.commit('removeSavedByProjectId', id);
          context.commit('removeContactedByProjectId', id);
          return resolve(response);
        })
        .catch(error => {
          context.commit('mutateEachProjectLoadingState', {id, value: false});
          context.commit('changeProjectsErrorState', error.response.data.errors);
        });
    });
  },
  fetchProjectsAction(context) {
    context.commit('mutateAllProjectsLoadingState', true);
    return new Promise((resolve, reject) => {
      CandidatesService.fetchProjects({limit: 100})
        .then(response => {
          context.commit('changeAllProjectsState', response.data.results);
          context.commit('changeProjectsMetaState', response.data.meta);
          context.commit('mutateAllProjectsLoadingState', false);
          resolve(response);
        })
        .catch(error => {
          context.commit('changeProjectsErrorState', error.response.data.errors);
          context.commit('mutateAllProjectsLoadingState', false);
        });
    });
  },
  fetchProjectsInBackgroundAction(context) {
    return new Promise((resolve, reject) => {
      CandidatesService.fetchProjects({limit: 100})
        .then(response => {
          context.commit('changeAllProjectsState', response.data.results);
          context.commit('changeProjectsMetaState', response.data.meta);
          resolve(response);
        })
        .catch(error => {
          context.commit('changeProjectsErrorState', error.response.data.errors);
        });
    });
  }
};
