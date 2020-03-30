import CandidatesService from 'top20common/distribution/services/candidates';
import tourService from 'top20common/distribution/services/hopscotch-tour';
/*eslint-disable */
import Vue from 'vue';

import router from '@/router';

const vueContext = new Vue();

export default {
  id: 'top20Talent',
  i18n: {
    nextBtn: vueContext.$gettext('Next'),
    prevBtn: vueContext.$gettext('Back'),
    doneBtn: vueContext.$gettext('Done'),
    skipBtn: vueContext.$gettext('Skip'),
    closeTooltip: vueContext.$gettext('Close')
  },
  steps: [
    {
      target: document.querySelectorAll('.logo')[0],
      placement: 'bottom',
      title: vueContext.$gettext('Welcome!'),
      content: vueContext.$gettext('Let’s give you a quick tour of what Top20Talent has to offer.')
    },
    {
      target: 'search',
      placement: 'bottom',
      title: vueContext.$gettext('Start your search'),
      content: vueContext.$gettext('Enter a job title, keyword or industry in the search bar to find candidates.'),
      showPrevButton: true,
      onNext: function() {
        let options = {};
        let params = vueContext.$filters.getFetchFiltersParams();
        if (params.search || params.city) {
          options = params;
        }
        tourService.finish(false);
        router.push({name: 'candidates', query: options, params: {isTour: true}});

        const countId = setInterval(() => {
          if (document.querySelectorAll('#findCandidate')[0]) {
            tourService.runTour(1, 2, 'top20Talent');
            clearInterval(countId);
          }
        }, 300);
      }
    },
    {
      target: 'findCandidate',
      placement: 'bottom',
      title: vueContext.$gettext('Find candidates'),
      content: vueContext.$gettext('When you search for candidates, this is where the results show up.'),
      showPrevButton: true,
      onPrev: function() {
        tourService.finish(false);
        router.push({name: 'projects', params: {isTour: true}});
        const countId = setInterval(() => {
          if (document.querySelectorAll('#search')[0]) {
            tourService.runTour(2, 1, 'top20Talent');
            clearInterval(countId);
          }
        }, 300);
      }
    },
    {
      target: 'clearFilter',
      placement: 'left',
      yOffset: '-80px',
      arrowOffset: 'center',
      title: vueContext.$gettext('Filter results'),
      content: vueContext.$gettext(
        'Refine your results by adding or removing locations, industries, and salary ranges. Or enter a new search query in the search box.'
      ),
      showPrevButton: true
    },
    {
      target: 'candidateSummaryTitle',
      placement: 'bottom',
      title: vueContext.$gettext('Candidate summary'),
      content: vueContext.$gettext(
        "Get a brief overview of a candidate's experience, or click to view their profile in detail."
      ),
      showPrevButton: true,
      multipage: true,
      onNext: function() {
        const code = CandidatesService.getFromLocalStorage('firstCandidateCode');
        tourService.finish(false);
        router.push({name: 'candidate', params: {code, isTour: true}});
        const countId = setInterval(() => {
          if (document.querySelectorAll('#candidate-city')[0]) {
            tourService.runTour(4, 5, 'top20Talent');
            clearInterval(countId);
          }
        }, 300);
      }
    },
    {
      target: 'candidate-city',
      placement: 'bottom',
      title: vueContext.$gettext('Candidate profile'),
      content: vueContext.$gettext(
        'Get detailed experience, find out what motivates a candidate, and get a read on their skills.'
      ),
      showPrevButton: true,
      xOffset: '-7px',
      onPrev: function() {
        let options = {};
        let params = vueContext.$filters.getFetchFiltersParams();
        if (params.search || params.city) {
          options = params;
        }
        tourService.finish(false);
        router.push({name: 'candidates', query: options, params: {isTour: true}});
        const countId = setInterval(() => {
          if (document.querySelectorAll('#candidateSummaryTitle')[0]) {
            tourService.runTour(5, 4, 'top20Talent');
            clearInterval(countId);
          }
        }, 300);
      }
    },
    {
      target: 'saveCandidateBtn',
      placement: 'left',
      title: vueContext.$gettext('Save or contact'),
      content: vueContext.$gettext(
        'Found an interesting profile? Save it to or click Contact to get in touch with the candidate and access their full CV.'
      ),
      showPrevButton: true,
      onNext: function() {
        tourService.finish(false);
        router.push({name: 'projects', params: {isTour: true}});
        const countId = setInterval(() => {
          if (document.querySelectorAll('#projects')[0]) {
            tourService.runTour(6, 7, 'top20Talent');
            clearInterval(countId);
          }
        }, 300);
      }
    },
    {
      target: 'projects',
      placement: 'bottom',
      title: vueContext.$gettext("We've come full circle!"),
      content: vueContext.$gettext('Your saved candidates and contacted candidates will show up here.'),
      showPrevButton: true,
      onPrev: function() {
        tourService.finish(false);
        const code = CandidatesService.getFromLocalStorage('firstCandidateCode');
        router.push({name: 'candidate', params: {code, isTour: true}});
        const countId = setInterval(() => {
          if (document.querySelectorAll('#saveCandidateBtn')[0]) {
            tourService.runTour(7, 6, 'top20Talent');
            clearInterval(countId);
          }
        }, 300);
      }
    },
    {
      target: 'inviteCandidate',
      placement: 'top',
      xOffset: '50px',
      arrowOffset: 'center',
      title: vueContext.$gettext('Having trouble searching?'),
      content: vueContext.$gettext('Put in a request, and our offline team will source candidates for you.'),
      showPrevButton: true
    }
  ]
};
