import {
  isBoolean,
  isNumber,
  isString,
} from './types';

type ErrorOptions = {
  /**
   * 是否忽略此错误
   */
  ignore?: boolean,
  /**
   * 是否展示给客户端
   */
  show?: boolean,
  /**
   * 后端返回的错误码
   */
  code?: number,
  /**
   * HTTP 状态码
   */
  status?: number,
  /**
   * 附加数据
   */
  // tslint:disable-next-line:no-any
  data?: any,
}


export default class ServerError extends Error {
  ignore: boolean;
  show: boolean;
  code: number;
  status: number;
  // tslint:disable-next-line:no-any
  data: any;

  constructor(options: ErrorOptions & { message: string });
  constructor(message: string);
  constructor(options: {
    message: string
  } & ErrorOptions | string) {
    isString(options) ? super(options) : super(options.message);

     this.ignore = false;
     this.show = true;
     this.code = 500;
     this.status = 500;
    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options: ErrorOptions) {
    if (isBoolean(options.ignore)) {
      this.ignore = options.ignore;
    }

    if (isBoolean(options.show)) {
      this.show = options.show;
    }

    if (isNumber(options.code)) {
      this.code = options.code;
    }

    if (isNumber(options.status)) {
      this.status = options.status;
    }

    if (options.data) {
      this.data = options.data;
    }
  }
}

