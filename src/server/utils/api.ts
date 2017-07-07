const axios = require('axios');
import { AxiosResponse } from 'axios';
import {
  SERVER_HANDLE_SUCCESS_CODE
} from '../../declarations/constants';
import ServerError from '../lib/error';

type ThriftStatus = {
  code: number;
  msg: string;
}

/**
 * 判断返回结果是否正常
 */
export const assertRetSuccess = (response: {
  status: ThriftStatus
 // tslint:disable-next-line:no-any
 }, method: string, args: any[]) => {
  const status = response.status || response; // 兼容 response 是一个 Status 结构的情况
  if (status.code === SERVER_HANDLE_SUCCESS_CODE) {
    return;
  } else {
    throw new ServerError({
      message: status.msg,
      code: status.code,
      data: {
        method,
        args,
      }
    });
  }
}

export const wxApi = axios.create({
  baseURL: 'https://api.weixin.qq.com',
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  validateStatus() {
    return true;
  }
});
export const alipayApi = axios.create({
  baseURL: 'https://openapi.alipay.com',
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  validateStatus() {
    return true;
  }
});

export const v2exApi = axios.create({
  baseURL: 'https://www.v2ex.com',
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  validateStatus() {
    return true;
  }
});
v2exApi.interceptors.response.use(function(response: AxiosResponse) {
  let url = response.config.url || '';
  if (response && url.includes('/api/') && response.status !== 200) {
    const error = new ServerError({
      message: '出错了',
      status: response.status,
      data: {
        method: response.config.method,
        ret: response.data
      }
    });
    return Promise.reject(error);
  }
  return response;
}, function(error: Error) {
  return Promise.reject(error);
});