function parseRoute(routeStr) {
  return (route) => {
    const strs = [];
    if (route.path) {
      strs.push(`path:"${route.path}"`);
    }
    if (route.alias) {
      strs.push(`alias:"${route.alias}"`);
    }
    const component = route.component;
    if (typeof component === 'object' && component.async) {
      let chunk = component.chunk;
      if (!component.chunk) {
        chunk = component.path.replace(/\//g, '_');
      }
      strs.push(`component: function (resolve) {
        require.ensure([], function() {
          resolve(require("${component.path}").default);
        }, "${chunk}");
      }`);
    } else if (typeof component === 'string') {
      strs.push(`component: require("${component}").default`);
    }

    if (typeof route.name === 'string') {
      strs.push(`name: "${route.name}"`);
    }

    if (route.children) {
      const subRoutes = [];
      route.children.forEach(parseRoute(subRoutes));
      strs.push('children:', `[${subRoutes.join(',')}]`)
    }
    routeStr.push(`{${strs.join(',')}}`);
  }
}

function loader(content) {
  const routes = JSON.parse(content);
  const result = [];
  const routeStr = [];
  routes.forEach(parseRoute(routeStr));
  return `module.exports = [${routeStr.join(',')}]`;
}

module.exports = loader;
