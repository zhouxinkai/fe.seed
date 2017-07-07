import config from 'client/config';
import { Store } from 'vuex';

const query: {
  [k: string]: string,
} = {};
location.search.slice(1, location.search.length).split('&').forEach(q => {
  const v = q.split('=');
  query[v[0]] = v[1];
});

let debugHost: string | undefined = query.__debug;

if (debugHost) {
  sessionStorage.setItem('debugHost', debugHost);
} else {
  debugHost = sessionStorage.getItem('debugHost') || undefined;
}

// tslint:disable-next-line:no-any
const debug = (...args: any[]) => {
  if (config.debug && debugHost) {
    console.info('DEBUG', ...args);
    let str: string;
    try {
      str = JSON.stringify(args);
    } catch (e) {
      str = JSON.stringify({
        message: 'can not stringify log data'
      });
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://${decodeURIComponent(debugHost)}/api/console/debug`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(str);
  }
}
export const vuexDebug = () => {
  return (store: Store<void>) => {
    store.subscribe(mutation => {
      debug(mutation);
    })
  }
}

export default debug;
export { debugHost };
