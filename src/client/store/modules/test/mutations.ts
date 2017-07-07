import { State } from './states';
import { Test } from 'store/types';
import { TopicList } from 'pages/test/types';

const {
  SET_V2EX_TOPIC_LIST
} = Test;

export default {
  [SET_V2EX_TOPIC_LIST](state: State, list: TopicList) {
    state.topicList = list;
  }
}

