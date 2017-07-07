import Vue from 'vue';
import Vuex from 'vuex';
import { api } from 'utils'

import { vuexDebug } from 'utils/debug';
Vue.use(Vuex);

import { State } from './states';
import { State as TestState } from './modules/test';

const getStoreOptions = () => ({
  state: require('./states').default,
  getters: require('./getters').default,
  mutations: require('./mutations').default,
  actions: require('./actions').default,
  modules: {
    test: require('./modules/test').default
  },
  plugins: [vuexDebug()]
  // tslint:disable-next-line:no-any
} as any);

type RootState = State & {
  test: TestState,
}

const store = new Vuex.Store(getStoreOptions()) as Vuex.Store<RootState>;

api.interceptors.response.use(function(response) {
  let url = response.config.url || '';
  if (response && url.includes('/api/') && response.status !== 200) {
    store.commit('setServerError', response.data);
  }
  return response;
}, function(error) {
  store.commit('setServerError', error)
  return Promise.reject(error);
});

export default store;

