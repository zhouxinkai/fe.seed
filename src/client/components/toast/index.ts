/// <reference types="promise" />
import Vue from 'vue';
import Component from 'vue-class-component';
require('./index.css');
export type ToastData = {
  icon: string,
  text: string,
  timeout: number,
}

// tslint:disable-next-line:no-any
let lastToastPromise: Promise<any> | null;

@require('./index.html')
@Component
class Toast extends Vue {
  text: string = '';
  icon: string = '';
  get _icon(): string {
    return `icon-${this.icon}`;
  }
}

export default (data: ToastData) => {
  lastToastPromise = Promise.resolve(lastToastPromise)
    .then(() => {
      const toast = new Toast({
        data,
      }).$mount();
      const body = document.getElementsByTagName('body')[0];
      body.appendChild(toast.$el);

      return new Promise((resolve) => {
        setTimeout(() => {
          body.removeChild(toast.$el);
          toast.$destroy();
          resolve(toast);
        }, data.timeout || 2000);
      });
    })
    .then((toast) => {
      lastToastPromise = null;
      return toast;
    });

  return lastToastPromise;
};
