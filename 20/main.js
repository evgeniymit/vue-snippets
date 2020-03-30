import '@babel/polyfill';
import 'top20common/node_modules/vue-svgicon/polyfill';
import '@/assets/js/polyfills/removeNodes';
import 'buefy/lib/buefy.css';

import Buefy from 'buefy';
import moment from 'moment';
import PortalVue from 'portal-vue';
import SvgIcon from 'top20common/components/SvgIcon';
import {browser} from 'top20common/distribution/plugins/browserDetermine';
import {icons} from 'top20common/distribution/plugins/dynamicallyIconsPath';
import {language} from 'top20common/distribution/plugins/language';
import languageService from 'top20common/distribution/services/languages';
import utils from 'top20common/distribution/utils';
import VTooltip from 'v-tooltip';
import VSwipe from 'vswipe';
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import GetTextPlugin from 'vue-gettext';
import VModal from 'vue-js-modal';
import MQ from 'vue-match-media/src';
import VueMultianalytics from 'vue-multianalytics';
import Router from 'vue-router';
import Vue2Filters from 'vue2-filters';
import VueTimepicker from 'vue2-timepicker';

import {archiveFeature} from '@/plugins/archive-project';
import {dateMoment} from '@/plugins/dateMoment';
import {filtersFeature} from '@/plugins/filters';
import mixpanelPlugin from '@/plugins/mixpanel';
import {savedSearchesFeature} from '@/plugins/saved-searches';
import {searchParams} from '@/plugins/searchParams';
import {sorterCandidatesFeature} from '@/plugins/sorter-candidates';
import {stringHelpers} from '@/plugins/stringHelpers';

import translations from '../../translations.json';
import App from './App';
import router from './router';
import store from './store';

Vue.use(PortalVue);

Vue.mixin({
  data() {
    return {
      mappingForNeedingTour: {
        false: false,
        true: true
      }
    };
  }
});

Vue.use(Router);
Vue.use(VueCookie);

Vue.use(language);

Vue.use(GetTextPlugin, {
  availableLanguages: {
    en_US: 'English',
    zh_Hans: 'Chinese'
  },
  defaultLanguage: languageService.getCurrent(),
  translations: translations,
  silent: true
});

Vue.use(searchParams);
Vue.use(sorterCandidatesFeature, {store});
Vue.use(archiveFeature, {store});

Vue.use(filtersFeature, {store});
Vue.use(savedSearchesFeature, {store});

Vue.use(VTooltip, {disposeTimeout: 0});
Vue.use(browser);
Vue.use(icons);
Vue.use(dateMoment);
Vue.use(stringHelpers);
Vue.use(Buefy);
Vue.use(MQ);
Vue.use(Vue2Filters);
Vue.use(VSwipe);
Vue.config.productionTip = false;
Vue.use(VModal);
Vue.use(VueTimepicker);
Vue.use(VModal);

Vue.use(require('vue-moment'), {moment});
if (new Vue().$language.isChinese()) {
  require('moment/locale/zh-cn');
}

const mixpanelConfig = {
  token: process.env.VUE_APP_MIXPANEL_KEY,
  debug: false
};

Vue.use(
  VueMultianalytics,
  {
    modules: {
      mixpanel: mixpanelConfig
    }
  },
  mixpanelPlugin
);

Vue.filter('truncate', function(text, stop, clamp) {
  return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '');
});

Vue.component('svg-icon', SvgIcon);

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  mq: {
    phone: '(max-width: 768px)',
    tablet: '(max-width: 1023px)',
    desktop: '(min-width: 1024px)'
  }
});

if (typeof SVGElement.prototype.blur === 'undefined') {
  // fix svg for IE11
  SVGElement.prototype.blur = function() {};
}

utils.setVueForUtils(app);
