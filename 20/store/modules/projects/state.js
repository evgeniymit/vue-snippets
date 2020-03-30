export default {
  projectFormState: {
    errors: null,
    loading: null,
    title: null,
    city: null,
    salaryMax: null,
    salaryMin: null,
    industry: null,
    requirements: null,
    attachments: null,
    keywords: null,
    status: null,
    type: null,
    advisors: null,
    is_uploaded: null,
    owner_email: null,
    connection_state: null,
    connection: null
  },
  reviewedNewFeaturesState: JSON.parse(localStorage.getItem('reviewedNewFeaturesList')) || [],
  allProjectsState: null,
  allProjectsLoadingState: null, // true if list of projects is loading
  eachProjectLoadingState: null, // key: project_id, value: boolean
  newProjectState: null,
  errorState: null,
  meta: {count: 0, users: [], projects: {}, statuses: [], types: [], talent_advisors: []},

  pipelinerCharacterState: null
};
