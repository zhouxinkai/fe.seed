import koa = require('koa');
import config = require('config');

export default async (ctx: koa.Context, next: Function) => {
  if (config.get('isDev')) return next();
  const start = new Date();
  await next();
  const end = new Date();
  const spend = end.getDate() - start.getDate();
  const log = ctx.status >= 400 ? console.error : console.log;
  log(ctx.status, ctx.method, ctx.path, ctx.querystring, 'SPEND:', spend);
  if (ctx.request.body && Object.keys(ctx.request.body).length) {
    log('REQ BODY', ctx.request.body);
  }
  if (ctx.body) {
    log('RES BODY', ctx.body);
  }
}
