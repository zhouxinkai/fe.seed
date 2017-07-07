import { ActionContext } from 'vuex';
import { State } from './states';
import { api } from 'utils';
import { Test } from 'store/types';

const {
  GET_V2EX_TOPIC_LIST,
  SET_V2EX_TOPIC_LIST
} = Test;

export default {
  // tslint:disable-next-line:no-any
  async[GET_V2EX_TOPIC_LIST](context: ActionContext<State, State>, cache: any) {
    try {

      // tslint:disable-next-line:no-any
      const response = cache ? { data: cache } : await api.get('/api/v2ex/topicList');
      context.commit(SET_V2EX_TOPIC_LIST, response.data);
    } catch (e) {
      console.error(e);
    }
  },
}

