import { Context } from 'koa';
import path = require('path');
import config = require('config');
import { route } from './decorator'
import PageState from './pagestate'

/**
 * 前端页面路由信息
 */
const routes = require(path.join(config.get('root') as string, 'src/client/routes.json'));

/**
 * 前端构建信息
 */
let buildMeta: {
  [chunk: string]: string
} = {};

if (!config.get('isDev')) {
  try {
    buildMeta = require(path.join(config.get('root') as string, 'buildMeta.json'));
  } catch (e) { }
}

/**
 * 处理 webpack dev server 和 node server 端口不一致
 */
function fileResolver(file: string) {
  if (config.get('isDev')) {
    return `http://${require('ip').address()}:${config.get('webpack.port')}${file}`;
  } else {
    return `${config.get('onlineHost')}/@${file}`;
  }
};

function getFinallyRoute(ctx: Context, route: { path: string, alias: string }) {
  for (let i = 0; i < routes.length; i++) {
    let r = routes[i];
    if (r.alias) {
      const splited = r.alias.split('?')
      if (splited.length > 1) {

        if (ctx.path === splited[0]) {
          const query = splited[1].split('&') as string[];
          if (query.every(q => !!ctx.query[q])) {
            return r.path;
          }
        }

      }
    }
  }

  return route.path
}

export class EntryController {
  @route('get', '/*')
  async entry(ctx: Context, next: Function) {
    const route = routes.find((r: { path: string, alias: string }) => {
        return r.path === ctx.path || r.alias === ctx.path;
    });
    if (!route) return next();

    const finalRoute = getFinallyRoute(ctx, route)

    /**
     * 首屏必要数据
     */
    let pageState = PageState[finalRoute] && await PageState[finalRoute](ctx);

    /**
     * 通过路由和构建信息，来自动加载对应的 chunk，加快页面读取速度
     */
    let chunkSrc: string | null = null;
    if (route && route.component && route.component.chunk) {
      const file = buildMeta[route.component.chunk];
      if (file) {
        chunkSrc = fileResolver(`/statics/${file}`);
      }
    }

    /**
     * 程序的入口文件
     */
    const mainFile = buildMeta['app'] || 'app.js';

    if (ctx.query.tenantId && ctx.query.poiId) {
      ctx.cookies.set('tenantId', ctx.query.tenantId, {
        httpOnly: false,
      });
      ctx.cookies.set('poiId', ctx.query.poiId, {
        httpOnly: false,
      });
    }

    const isProd = config.get('isProd');
    const browserConfig = {
      debug: config.get('feDebug'),
      prod: isProd
    };

    return `<html>
      <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <script>
          var fontSize = window.innerWidth / 320 * 75;
          document.documentElement.style.fontSize = fontSize + 'px';
        </script>
      </head>
      <body>
          <div id="app">
          </div>
          <script>
            var config = ${JSON.stringify(browserConfig)}
            var pageState = ${JSON.stringify(pageState)} || {}
          </script>
          <script src="${fileResolver('/statics/' + mainFile)}"></script>
          ${chunkSrc ? '<script src="' + chunkSrc + '"></script>' : ''}
      </body>
    </html>`;
  }
}
