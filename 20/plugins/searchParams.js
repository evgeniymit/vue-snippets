import forEach from 'lodash/forEach';

export const searchParams = {};
searchParams.install = function(Vue, options) {
  Vue.prototype.$defineSearchParams = function(searchParams) {
    let resultParams = {};
    forEach(searchParams, function(value, key) {
      if (value && value !== Infinity) {
        resultParams[key] = value;
      }
    });
    return resultParams;
  };
};
