import { Context } from 'koa';
import config = require('config');
import { route } from './decorator'

export default class ConsoleDebugController {
  @route('post', '/api/console/debug')
  debug(ctx: Context) {
    const data = ctx.request.body;
    if (config.get('feDebug')) {
      console.log(new Date(), 'FE DEBUG:');
      console.log(JSON.stringify(data, null, 2));
    }
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.status = 204;
  }

  @route('options', '/api/console/debug')
  options(ctx: Context) {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.status = 204;
  }
}


