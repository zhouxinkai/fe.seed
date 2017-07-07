import axios from 'axios';
import { createDecorator } from 'vue-class-component';

export const oneHour = 60 * 60 * 1000;
export const oneMin = 60 * 1000;
export const oneSec = 1000;

// tslint:disable-next-line:no-any
export function isNumber(num: any): boolean {
  return typeof num === 'number';
}

export const api = axios.create({
  // baseURL: '/api',
  withCredentials: true,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  validateStatus() {
    return true;
  },
});

export function last<T>(array: Array<T>): T {
  return array[array.length - 1];
}

export const Prop = createDecorator((
  options: { props?: { [k: string]: boolean } },
  key: string,
) => {
  // component options should be passed to the callback
  // and update for the options affect the component
  (options.props || (options.props = {}))[key] = true;
})

let lut: string[] = (() => {
  let tpl = []

  for (let i = 0; i < 256; i++) {
    tpl[i] = (i < 16 ? '0' : '') + (i).toString(16);
  }

  return tpl
})();

/**
 * fast generate 32-length uuid
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
export function guid() {
  let d0 = Math.random() * 0xffffffff | 0;
  let d1 = Math.random() * 0xffffffff | 0;
  let d2 = Math.random() * 0xffffffff | 0;
  let d3 = Math.random() * 0xffffffff | 0;

  let strs = [
    lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff],
    lut[d1 & 0xff] + lut[d1 >> 8 & 0xff],
    lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff],
    lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff],
    lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff],
    lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff]
  ]
  return strs.join('')
}

export function priceText(price: number): number {
  if (typeof price !== 'number') {
    throw 'buffet@ pirce is not number!';
  }
  return Math.round(price) / 100;
}

export function deleteObjOptionalProp(obj: {
  // tslint:disable-next-line:no-any
  [key: string]: any
}) {
  for (const key of Object.keys(obj)) {
    // tslint:disable-next-line:no-any
    const value = obj[key];

    if (Array.isArray(value)) {
      if (value.length) {
        for (let i = 0; i < value.length; i++) {
          const index = value[i];
          if (Array.isArray(index) || typeof index === 'object') {
            deleteObjOptionalProp(index);
          } else if (!index) {
            value.splice(i, 1);
          }
        }
      } else {
        Reflect.deleteProperty(obj, key);
      }
    } else if (typeof value === 'object') {
      if (!Object.keys(value).length) {
        Reflect.deleteProperty(obj, key);
      } else {
        deleteObjOptionalProp(value);
      }
    } else if (!value) {
      Reflect.deleteProperty(obj, key);
    }
  }
}

// Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// .Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
export function formatDate(idate: Date, fmt: string): string {
  const o: {
    [inxde: string]: number
  } = {
      'M+': idate.getMonth() + 1,
      'd+': idate.getDate(),
      'h+': idate.getHours(),
      'm+': idate.getMinutes(),
      's+': idate.getSeconds(),
      'q+': Math.floor((idate.getMonth() + 3) / 3),
      S: idate.getMilliseconds(),
    };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (idate.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const temp = (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length));
      fmt = fmt.replace(RegExp.$1, temp as string);
    }
  }
  return fmt;
}
// tslint:disable-next-line:no-any
export function deepClone(item: any) {
    if (!item) { return item; } // null, undefined values check

    let types = [ Number, String, Boolean ],
        // tslint:disable-next-line:no-any
        result: any;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
        if (item instanceof type) {
            result = type( item );
        }
    });

    if (typeof result === 'undefined') {
        if (Object.prototype.toString.call( item ) === '[object Array]') {
            result = [];
            // tslint:disable-next-line:no-any
            (item as any[]).forEach(function(child, index) {
                result[index] = deepClone( child );
            });
        } else if (typeof item === 'object') {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode === 'function') {
                result = item.cloneNode( true );
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (let i in item) {
                        result[i] = deepClone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    // result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}

// from https://www.zhihu.com/question/26228251
export function setTitle(t: string) {
  // 经测试这样是可以直接修改 title 的
  // 低版本微信未知
  document.title = t;
  // let i = document.createElement('iframe');
  // i.src = '//m.baidu.com/favicon.ico';
  // i.style.display = 'none';
  // i.onload = function() {
  //   setTimeout(() => i.remove(), 9)
  // }
  // document.body.appendChild(i);
}


export function throttle(fn: Function, wait: number, mustRun: number) {
  let timeout: null | number = null, startTime = (new Date).getTime();

  return function () {
    if (timeout !== null) clearTimeout(timeout);
    let curTime = (new Date).getTime();
    if (curTime - startTime >= mustRun) {
      fn();
      startTime = curTime;
    } else {
      timeout = setTimeout(fn, wait);
    }
  }
}

/**
 * remove value in array
 */
export function remove<T>(array: T[], value: T) {
  let index = array.findIndex(i => i === value);
  if (index >= 0) {
    array.splice(index, 1)
  }
}
