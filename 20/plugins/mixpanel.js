import {isEmpty} from 'lodash';
import formatter from 'top20common/distribution/services/formatter';
import mixpanelCommon from 'top20common/distribution/services/mixpanel-tracker/config';

export default function(multianalytics) {
  const mixpanel = mixpanelCommon(multianalytics);

  function booleanToYesNo(value) {
    return value ? 'yes' : 'no';
  }

  function getProjectInfo(project) {
    if (isEmpty(project)) {
      return '';
    }
    let salary = formatter.getSalaryNameSimplified(project.salary_min, project.salary_max);
    const projectItems = [project.title, salary, project.city, project.industry];
    return projectItems.filter(n => n).join(', ');
  }

  mixpanel.trackFilterSelect = function(values, count, type) {
    mixpanel.trackEvent({
      action: `Filter Select ${type}`,
      properties: {
        Count: count,
        [type]: values
      }
    });
  };

  mixpanel.trackFindCandidates = function(
    action,
    search = '',
    location = '',
    queryParams = '',
    resultsCount = 'unknown'
  ) {
    mixpanel.trackEvent({
      action: 'Find Candidates',
      properties: {
        Action: action,
        Query: search,
        Location: location,
        Results: resultsCount,
        Parameters: queryParams
      }
    });
  };

  mixpanel.trackSaveCandidate = function(action, candidateTitle, isContacted, location, project) {
    mixpanel.trackEvent({
      action: 'Save Candidate',
      properties: {
        Action: action,
        Candidate: candidateTitle,
        Contacted: booleanToYesNo(isContacted),
        Location: location,
        Project: getProjectInfo(project)
      }
    });
  };

  mixpanel.trackRemoveCandidate = function(source, candidateTitle, isContacted, location, project) {
    mixpanel.trackEvent({
      action: 'Remove Candidate',
      properties: {
        Candidate: candidateTitle,
        Contacted: booleanToYesNo(isContacted),
        Location: location,
        Project: getProjectInfo(project),
        Source: source
      }
    });
  };

  mixpanel.trackDownloadCv = function(source, candidateTitle, isSaved, project, location) {
    mixpanel.trackEvent({
      action: 'Download CV',
      properties: {
        Candidate: candidateTitle,
        Saved: booleanToYesNo(isSaved),
        Location: location,
        Project: getProjectInfo(project),
        Source: source
      }
    });
  };

  mixpanel.trackSaveCandidateToProject = function(candidateTitle, isContacted, location, project, source) {
    mixpanel.trackEvent({
      action: 'Save Candidate to Project',
      properties: {
        Candidate: candidateTitle,
        Contacted: booleanToYesNo(isContacted),
        Location: location,
        Project: getProjectInfo(project),
        Source: source
      }
    });
  };

  mixpanel.trackCreateProjectClick = function(source) {
    mixpanel.trackEvent({
      action: 'Create Project Click',
      properties: {
        Source: source
      }
    });
  };

  mixpanel.trackEditProjectClick = function() {
    mixpanel.trackEvent({action: 'Edit Project'});
  };

  mixpanel.trackSaveProject = function(action, project) {
    mixpanel.trackEvent({
      action: 'Save Project',
      properties: {
        Action: action,
        'Job title': project.title,
        Location: project.city,
        Industry: project.industry,
        Salary: formatter.getSalaryNameSimplified(project.salary_min, project.salary_max),
        Requirements: project.requirements,
        Attachment: project.attachment ? project.attachment.name : 'none',
        Keywords: project.keywords && project.keywords.length ? project.keywords.join(',') : ''
      }
    });
  };

  mixpanel.trackContactCandidateClick = function(candidateTitle, isSaved, location, project) {
    mixpanel.trackEvent({
      action: 'Contact Candidate Click',
      properties: {
        Candidate: candidateTitle,
        Saved: booleanToYesNo(isSaved),
        Location: location,
        Project: getProjectInfo(project)
      }
    });
  };

  mixpanel.trackContactCandidateSent = function(candidateTitle, isSaved, location, project) {
    mixpanel.trackEvent({
      action: 'Contact Candidate Sent',
      properties: {
        Candidate: candidateTitle,
        Saved: booleanToYesNo(isSaved),
        Location: location,
        Project: getProjectInfo(project)
      }
    });
  };

  mixpanel.trackContactCandidateUpdateRequest = function(
    candidateTitle,
    isSaved,
    location,
    project,
    purpose,
    message,
    interviewDate,
    interviewTime,
    address
  ) {
    mixpanel.trackEvent({
      action: 'Contact Candidate Update Request',
      properties: {
        Candidate: candidateTitle,
        Saved: booleanToYesNo(isSaved),
        Location: location,
        Project: getProjectInfo(project),
        Purpose: purpose,
        Message: message,
        'Interview date': interviewDate,
        'Interview time': interviewTime,
        Address: address
      }
    });
  };

  mixpanel.trackContactCandidateClosed = function() {
    mixpanel.trackEvent({action: 'Contact Candidate Close'});
  };

  mixpanel.trackContactCandidateHover = function() {
    mixpanel.trackEvent({action: 'Contact Candidate Hover'});
  };

  mixpanel.trackRequestCandidateClicked = function() {
    mixpanel.trackEvent({action: 'Request Candidates Clicked'});
  };

  mixpanel.trackActivateCOIClicked = function() {
    mixpanel.trackEvent({action: 'Activate Companies of Interest Clicked'});
  };

  mixpanel.trackSettingsClicked = function() {
    mixpanel.trackEvent({action: 'Settings Clicked'});
  };

  mixpanel.trackSavedSearchAdded = function(source) {
    mixpanel.trackEvent({
      action: 'Saved Search Added',
      properties: {
        Source: source
      }
    });
  };

  mixpanel.trackSavedSearchRemoved = function(source) {
    mixpanel.trackEvent({
      action: 'Saved Search Removed',
      properties: {
        Source: source
      }
    });
  };

  mixpanel.trackPipelinerHover = function() {
    mixpanel.trackEvent({action: 'Pipeliner Hover'});
  };

  mixpanel.trackPipelinerClick = function() {
    mixpanel.trackEvent({action: 'Pipeliner Click'});
  };

  mixpanel.trackUnlockCvClick = function(candidateTitle, isSaved, location, project) {
    mixpanel.trackEvent({
      action: 'Unlock CV',
      properties: {
        Candidate: candidateTitle,
        Saved: booleanToYesNo(isSaved),
        Location: location,
        Project: getProjectInfo(project)
      }
    });
  };

  mixpanel.trackProjectsTabClick = function(tabName) {
    mixpanel.trackEvent({
      action: 'Projects Tab Click',
      properties: {
        Stage: tabName
      }
    });
  };

  mixpanel.trackExpandCandidateToggle = function(candidateCode, isUnread, contactedStatus, wasOpened) {
    mixpanel.trackEvent({
      action: 'Expand Candidate Toggle',
      properties: {
        Code: candidateCode,
        Unread: booleanToYesNo(isUnread),
        Stage: contactedStatus,
        Toggle: wasOpened ? 'expand' : 'collapse'
      }
    });
  };

  mixpanel.trackExpandArrowClick = function(wasOpened) {
    mixpanel.trackEvent({
      action: 'Expand Arrow Click',
      properties: {
        Toggle: wasOpened ? 'expand' : 'collapse'
      }
    });
  };

  mixpanel.trackBackFromProfileClick = function(destination) {
    mixpanel.trackEvent({
      action: 'Back From Profile Click',
      properties: {
        Destination: destination
      }
    });
  };

  mixpanel.trackCandidateRowHover = function(candidateCode, isUnread) {
    mixpanel.trackEvent({
      action: 'Candidate Hover',
      properties: {
        Code: candidateCode,
        Unread: booleanToYesNo(isUnread)
      }
    });
  };
  return mixpanel;
}
