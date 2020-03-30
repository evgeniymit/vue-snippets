import {forEach, pickBy} from 'lodash';

export default {
  reviewedNewFeaturesState: state => {
    return state.reviewedNewFeaturesState;
  },
  projectFormState: state => {
    return state.projectFormState;
  },
  allProjectsState: state => {
    return state.allProjectsState;
  },
  authorsNameByIdForProjects: state => {
    return state.meta.users;
  },
  projectsMetaById: state => {
    return state.meta.projects;
  },
  statusesMeta: state => {
    return state.meta.statuses;
  },
  typesMeta: state => {
    return state.meta.types;
  },
  advisorsMeta: state => {
    return state.meta.talent_advisors;
  },
  newProjectState: state => {
    return state.newProjectState;
  },
  allProjectsLoadingState: state => {
    return state.allProjectsLoadingState;
  },
  eachProjectLoadingState: state => {
    return state.eachProjectLoadingState || {};
  },
  projectsByCandidateIdState: (state, getters) => {
    const allSavedCandidates = getters.savedCandidatesListState || [];
    const allContactedCandidates = getters.contactedCandidatesState.list || [];
    const allProjects = getters.allProjectsState || {};

    let projectsByCandidateId = {};

    for (let saved of allSavedCandidates) {
      projectsByCandidateId[saved.candidate.id] = allProjects[saved.project_id];
    }
    for (let contacted of allContactedCandidates) {
      projectsByCandidateId[contacted.candidate.id] = allProjects[contacted.project_id];
    }
    return projectsByCandidateId;
  },
  pipelinerCharacterState: state => {
    return state.pipelinerCharacterState || {};
  },
  industryNamesByProjectIdState: (state, getters) => {
    let industryNamesByProjectId = {};
    forEach(getters.allProjectsState, (project, projectId) => {
      let industryNames = [];
      const projectIndustries = project.industry ? project.industry.split(',') : [];
      forEach(projectIndustries, industrySlug => {
        const industry = getters.allFiltersState.industries ? getters.allFiltersState.industries[industrySlug] : null;
        industryNames.push(industry ? industry.name : industrySlug);
      });
      industryNamesByProjectId[projectId] = industryNames;
    });
    return industryNamesByProjectId;
  },
  cityNamesByProjectIdState: (state, getters) => {
    let cityNamesByProjectId = {};
    forEach(getters.allProjectsState, (project, projectId) => {
      const city = getters.allFiltersState.cities ? getters.allFiltersState.cities[project.city] : null;
      cityNamesByProjectId[projectId] = city ? city.name : project.city;
    });
    return cityNamesByProjectId;
  },
  accountArchivedProjectsIdsState: (state, getters) => {
    return Object.keys(
      pickBy(getters.projectsMetaById, (projectMeta, projectId) => {
        return projectMeta.status === 'archived';
      })
    );
  }
};
