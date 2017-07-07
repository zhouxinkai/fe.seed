import { RouteConfig, Route } from 'vue-router';
import store from 'store';
import { Test } from 'store/types';

/**
 * 若要在某个路由里
 * 加入 beforeEnter hook
 * 写入下面这个表中
 */
const beforeEnterTable = {
  ['/test'](to: Route, from: Route) {
    to;
    from;
    // 预加载逻辑
    store.dispatch(Test.GET_V2EX_TOPIC_LIST, pageState.v2exTopicList);
  },
} as { [k: string]: Function }

export function wrapRoutes(routes: RouteConfig[]) {
  // tslint:disable-next-line:no-any
  routes.forEach((route: any) => {
    hook(route)
  });

  // tslint:disable-next-line:no-any
  function hook(route: any) {
    const load = beforeEnterTable[(route.path as string)];

    if (load) {
      const tmp = route.beforeEnter
      route.beforeEnter = function(to: Route, from: Route, next: Function) {
        load.apply(null, arguments);
        tmp && tmp.apply(route, arguments);
        to;
        from;
        next();
      }
    }
  }

  return routes;
}
