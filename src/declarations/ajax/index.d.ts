// tslint:disable-next-line:no-any
declare var pageState: any;

declare const config: {
  payBizId: number,
  payHost: string,
  payProtocol: string
  tenantId: number,
  poiId: number,
  tableId: number,
  debug: boolean,
  prod: boolean
};


declare type ServerErrorDetail = {
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
  message?: string,
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
