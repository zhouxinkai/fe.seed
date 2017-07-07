import Vue from 'vue';
import Component from 'vue-class-component';
import Loading from 'components/loading';
import toast from 'components/toast';
import { TopicList } from 'pages/test/types';
import { Test } from 'store/types';
import store from 'store';
require('./index.css');

@require('./index.html')
@Component({
  components: {
    Loading,
  }
})
export default class KTest extends Vue {
  isShowLoading: boolean = false;
  topicList: TopicList = [];
  test: string = 'test11';
  mounted() {
  }
  destroyed() {
  }
  showToast() {
    toast({
      icon: 'success',
      text: 'this is a toast',
      timeout: 1000
    })
  }
  async getV2exTopicList() {
    try {
      this.isShowLoading = true;
      await store.dispatch(Test.GET_V2EX_TOPIC_LIST);
      // 上面这行也可以注释掉，因为我们采用了首屏加载
      this.isShowLoading = false;
      this.topicList = store.state.test.topicList;
    } catch (e) {
      this.isShowLoading = false;
      throw e;
    }
  }
  resetV2exTopicList() {
    this.topicList = [];
  }
}
