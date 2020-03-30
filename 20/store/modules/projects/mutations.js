import {forEach} from 'lodash';

export default {
  mutateReviewedNewFeaturesState(state, data) {
    if (!state.reviewedNewFeaturesState.includes(data)) {
      state.reviewedNewFeaturesState.push(data);
      localStorage.setItem('reviewedNewFeaturesList', JSON.stringify(state.reviewedNewFeaturesState));
    }
  },
  mutateProjectFormState(state, data) {
    state.projectFormState = {
      ...state.projectFormState,
      ...data
    };
  },
  clearProjectFormState(state) {
    let clearFormState = {};
    forEach(state.projectFormState, (value, key) => {
      clearFormState[key] = null;
    });
    state.projectFormState = clearFormState;
  },
  clearNewProjectState(state) {
    state.newProjectState = null;
  },
  mutateNewProjectState(state, id) {
    state.newProjectState = id;
  },
  mutateAllProjectsLoadingState(state, value) {
    state.allProjectsLoadingState = value;
  },
  changeAllProjectsState(state, payload) {
    const localListProjects = {};
    forEach(payload, project => {
      localListProjects[project.id] = project;
    });
    state.allProjectsState = localListProjects;
  },
  changeProjectsMetaState(state, meta) {
    state.meta = meta;
  },
  changeProjectsErrorState(state, error) {
    state.errorState = error;
  },
  addToAllProjectsState(state, project) {
    state.allProjectsState = {
      [project.id]: project,
      ...state.allProjectsState
    };
  },
  changeProjectInAllProjectsState(state, project) {
    let projects = {...state.allProjectsState};
    projects[project.id] = {...projects[project.id], ...project};
    state.allProjectsState = projects;
  },
  deleteProjectInAllProjectsState(state, project) {
    let projects = {...state.allProjectsState};
    delete projects[project.id];
    state.allProjectsState = projects;
    let metaProjects = {...state.meta.projects};
    delete metaProjects[project.id];
    state.meta = {...state.meta, projects: metaProjects};
  },
  mutateEachProjectLoadingState(state, {id, value}) {
    state.eachProjectLoadingState = {
      ...state.eachProjectLoadingState,
      [id]: value
    };
  },
  mutatePipelinerCharacterState(state, {projectId, isShowing}) {
    state.pipelinerCharacterState = {
      ...state.pipelinerCharacterState,
      [projectId]: isShowing
    };
  }
};
