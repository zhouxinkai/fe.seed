import Koa = require('koa');
import routes from './routes';
import middlewares from './middlewares';
import bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(require('koa-compress')())
app.use(bodyParser());
middlewares(app);

app.use(routes);

export default app;

