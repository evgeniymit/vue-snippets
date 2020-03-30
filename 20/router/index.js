import {b2b} from 'top20common/distribution/scopes';
import auth from 'top20common/distribution/services/auth';
import languageService from 'top20common/distribution/services/languages';
import Vue from 'vue';
import GetTextPlugin from 'vue-gettext';
import Router from 'vue-router';
import VueScrollTo from 'vue-scrollto';

import store from '@/store';

import translations from '../../../translations.json';

const CandidatePage = () => import('@/pages/profile/CandidatePage.vue');
const CandidatesPage = () => import('@/pages/candidates/CandidatesPage.vue');
const ProjectsPage = () => import('@/pages/projects/ProjectsPage.vue');
const RouteNotFound = () => import('top20common/components/RouteNotFound');

Vue.use(GetTextPlugin, {
  availableLanguages: {
    en_US: 'English',
    zh_Hans: 'Chinese'
  },
  defaultLanguage: languageService.getCurrent(),
  translations: translations,
  silent: true
});

const vue = new Vue();
let title = process.env.VUE_APP_IS_O2O === 'true' ? vue.$gettext('CGP O2O powered by Top20Talent') : 'Top20Talent';
const findCandidatesPageTitle = vue.$gettext('Find Candidates');
const projectsPageTitle = vue.$gettext('Projects');

const routes = [
  {
    path: '/',
    redirect: {
      name: 'projects'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    beforeEnter(to, from, next) {
      window.location.href = '/projects';
    },
    meta: {scopes: [b2b]}
  },
  {
    path: '/:lang?/projects',
    name: 'projects',
    meta: {title: `${projectsPageTitle} - ${title}`, scopes: [b2b]},
    component: ProjectsPage
  },
  {
    path: '/:lang?/candidates/:code/:title?',
    name: 'candidate',
    meta: {
      title: `${findCandidatesPageTitle} - ${title}`,
      scopes: [b2b],
      metaTags: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }
      ]
    },
    component: CandidatePage
  },
  {
    path: '/:lang?/candidates',
    name: 'candidates',
    meta: {title: `${findCandidatesPageTitle} - ${title}`, scopes: [b2b]},
    component: CandidatesPage
  },
  {
    path: '*',
    component: RouteNotFound
  }
];

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_PREFIX || '/',
  routes,
  linkActiveClass: 'is-active'
});

router.beforeEach((to, from, next) => {
  auth.beforeEachRouteAuth(router, store, to, from, next);
});

function scrollToAnchor() {
  setTimeout(() => {
    const previousAnchor = store.getters.previousAnchorState;
    if (previousAnchor) {
      const element = document.getElementById(previousAnchor);
      if (element) {
        VueScrollTo.scrollTo(element, 300, {
          easing: [0.6, 0, 0.3, 1],
          offset: -5
        });
        store.commit('mutatePreviousAnchorState', null);
      }
    }
  }, 0);
}

router.afterEach((to, from) => {
  if (to.path !== from.path) {
    VueScrollTo.scrollTo({x: 0, y: 0});
    if (!router.app.$browserDetermine.isIE11()) {
      scrollToAnchor();
    }
  }
  document.title = to.meta.title || title;
});

export default router;
