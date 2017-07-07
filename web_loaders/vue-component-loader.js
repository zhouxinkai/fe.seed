const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');

function injectHotLoadToJS(content, filepath, query) {
  const ctx = this;

  content += `
    ;;if (module.hot) {
      (function() {
        let Component;
        if (module.exports.__esModule) {
          Component = module.exports.default;
        } else {
          Component = module.exports;
        }
        const Vue = require('vue').default;
        if (!Component || Component.name !== 'VueComponent') {
          return;
        }
        const options = Component.options;
        module.hot.accept();
        const hotAPI = require('vue-hot-reload-api');
        hotAPI.install(Vue, false);
        if (!module.hot.data) {
          hotAPI.createRecord('${filepath}', options)
        } else {
          hotAPI.reload('${filepath}', options)
        }
      })();
    }
    `;
  return content;
}

function loader(content) {
  const  query = (this.query === '' ? {} : loaderUtils.parseQuery(this.query)); // https://github.com/jballant/webpack-strip-block/issues/4
  if (this.cacheable) {
    this.cacheable();
  }

  const filepath = this.resourcePath;
  return injectHotLoadToJS.call(this, content, filepath, query);
}

module.exports = loader;
