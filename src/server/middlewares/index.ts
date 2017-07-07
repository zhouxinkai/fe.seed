import Koa from 'koa';
import error from './error';
import log from './log';

export default (app: Koa) => {
  app.use(log);
  app.use(error);
}
