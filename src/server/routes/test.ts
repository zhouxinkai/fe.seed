import { Context } from 'koa';
import { route } from './decorator';
import { v2exApi } from '../utils/api';

export default class TestController {
  @route('get', '/api/v2ex/topicList')
  async getV2exTopicList(ctx: Context) {
    ctx;
    const ret = await v2exApi({
      method: 'get',
      url: '/api/topics/hot.json'
    });
    console.log(ret.data);
    return ret.data;
  }
}