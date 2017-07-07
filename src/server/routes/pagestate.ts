import TestController from './test'
import { Context } from 'koa'

export default {
  async ['/test'](ctx: Context) {
    let ret;

    try {
      const values = await Promise.all([
        (new TestController()).getV2exTopicList(ctx)
      ])
      ret = {
        v2exTopicList: values[0],
      }
    } catch (e) {
      ret = null
    }

    return ret;
  }
} as { [k: string]: Function }
