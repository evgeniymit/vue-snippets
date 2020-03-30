import {forEach} from 'lodash';
export const archiveFeature = {};
archiveFeature.install = function(Vue, {store}) {
  Vue.prototype.$archive = (function() {
    const archive = {};

    archive.changeArchiveStatusForProject = function(project) {
      const {id} = project;
      store.dispatch('editProjectAction', {
        id,
        options: {
          status: project.is_archived ? 'approved' : 'archived'
        }
      });
    };
    archive.getArchivedProjects = function() {
      let projects = store.getters.allProjectsState;
      let archived = {};
      forEach(projects, (project, id) => {
        if (project.is_archived) {
          archived[id] = project;
        }
      });
      return archived;
    };
    archive.getUnarchivedProjects = function() {
      let projects = store.getters.allProjectsState;
      let unarchived = {};
      forEach(projects, (project, id) => {
        if (!project.is_archived) {
          unarchived[id] = project;
        }
      });
      return unarchived;
    };
    return archive;
  })();
};
