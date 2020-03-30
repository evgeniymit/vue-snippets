export const stringHelpers = {};
stringHelpers.install = function(Vue, options) {
  Vue.prototype.$fromCamelCaseToDashed = function(string) {
    return string
      .replace(/\W+/g, '-')
      .replace(/([a-z\d])([A-Z])/g, '$1-$2')
      .toLowerCase();
  };
};
