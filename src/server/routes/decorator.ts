import { Context } from 'koa';
import Router = require('koa-router');
import pathToRegexp = require('path-to-regexp');

type Method = 'get' | 'post' | 'put' | 'delete' | 'all' | 'options';

export type Route = {
  method: Method,
  url: string,
  fn: (ctx: Context, next: Function) => void,
  regexp: RegExp,
  name: string,
  urlKeys: pathToRegexp.Key[],
};

// tslint:disable-next-line:no-any
const targetRoutesMap: Map<any, Route[]> = new Map();
const instanceCache = new Map();
const routes: Route[] = [];

export function route(method: Method, url: string | string[]) {
  // tslint:disable-next-line:no-any
  return (target: any, name: string) => {
    let instance = instanceCache.get(target);
    if (!instance) {
      // 实例化路由 controller
      instance = new target.constructor();
      instanceCache.set(target, instance)
    }

    if (!Array.isArray(url)) {
      url = [url];
    }

    url.forEach(u => {
      const urlKeys: pathToRegexp.Key[] = [];

      const route = {
        method,
        url: u,
        fn: async (ctx: Context, next: Function) => {
          const result = await instance[name].call(instance, ctx, next);
          ctx.body = ctx.body || result;
        },
        regexp: pathToRegexp(url, urlKeys),
        name,
        urlKeys,
      };

      // 将路由信息和对应的 Controller 关联起来
      let targetRoutes = targetRoutesMap.get(target.constructor);
      if (!targetRoutes) {
        targetRoutes = [];
      }
      targetRoutes.push(route);
      targetRoutesMap.set(target.constructor, targetRoutes);

      routes.push(route);
    })
  }
}

export function setRouter(router: Router) {
  routes.forEach(route => {
    router[route.method](route.url, route.fn);
  })
}

/**
 * 判断一个路径是否在一个 controller 内有相应的方法
 */
// tslint:disable-next-line:no-any
export function match(controller: any, path: string): {
  fn: Function,
// tslint:disable-next-line:no-any
  params: any,
} | null {
  const targetRoutes = targetRoutesMap.get(controller.constructor);
  // tslint:disable-next-line:no-any
  const params: any = {};
  if (!targetRoutes) return null;
  const route = targetRoutes.find(r => {
    const execArray = r.regexp.exec(path);
    if (!execArray) return false;
    r.urlKeys.forEach((k, i) => {
      params[k.name] = execArray[i + 1];
    });
    return true;
  });
  if (!route) return null;
  return {
    fn: controller[route.name],
    params,
  };
}
