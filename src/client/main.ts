import Vue from 'vue';
import VueRouter from 'vue-router';
import Component from 'vue-class-component';
import store from 'store';
import Popup from 'components/popup'
import debug from 'utils/debug';
import { wrapRoutes } from './wrap-route'

require('normalize.css/normalize.css');
require('./index.css');

Vue.use(VueRouter);
const routes = wrapRoutes(require('./routes.json'));
const router = new VueRouter({
  mode: 'history',
  routes,
});

@require('./index.html')
@Component({
  router, store,
  components: { Popup }
})
class App extends Vue {
  get serverErrorDetail() {
    return store.state.serverErrorDetail
  }

  closeError() {
    store.commit('silentServerError');
  }
}

debug('page load', location.toString(), 'history length', history.length);
dirtyInit();
start();

if (config.prod) {
  Vue.config.errorHandler = (err, vm, fn) => {
    console.error(err, vm.$options.name, fn);
  }
}

async function start() {
  new App().$mount('#app')
}

function dirtyInit() {
  router.beforeEach((to, from, next) => {
    to; from;
    debug('history length', history.length);
    next();
  });

  window.addEventListener('popstate', (event: PopStateEvent) => {
    debug('popstate', event.state, location.toString());
  });
}
