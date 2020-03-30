import moment from 'moment';

export const dateMoment = {};
dateMoment.install = function(Vue, options) {
  Vue.prototype.$getDateMoment = function(time, format) {
    return moment.utc(time).format(format);
  };
};
