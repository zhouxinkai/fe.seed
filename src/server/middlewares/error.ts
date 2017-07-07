import {
  Context,
} from 'koa';
import ServerError from '../lib/error';
import config = require('config');

function renderErrorHtml(e: ServerError) {
  return `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta charset=“utf-8”>
      <title></title>
    </head>
    <body>
      <h3>${e.message}</h3>
      ${e.code ? `<p>CODE:${e.code}</p>` : ' '}
      ${config.get('isDev') ? `<pre>${e.stack}</pre>` : ''}
    </body>
  </html>
  `;
}

export default async (ctx: Context, next: Function) => {
  try {
    await next();
  } catch (e) {
    const err: ServerError = e;

    if (ctx.accepts('html')) {
      ctx.body = renderErrorHtml(err);
    } else if (ctx.accepts('json')) {
      const body: {
        message: string,
        code: number,
        stack?: string,
        show?: boolean
      } = {
        message: err.message,
        code: err.code,
        show: err.show
      };

      if (config.get('isDev')) {
        body.stack = err.stack;
      }
      ctx.body = body;
    } else {
      ctx.body = err.message;
    }

    if (!ctx.status || ctx.status === 200) {
      if (e.status) {
        ctx.status = err.status;
      } else {
        ctx.status = 500;
      }
    }

    if (e instanceof Error) {
      console.error('ERROR', e);
    } else {
      console.error('ERROR', JSON.stringify(e));
    }
  }
}
