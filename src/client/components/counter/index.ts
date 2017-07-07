import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'utils';

require('./index.css');

@require('./index.html')
@Component
export default class Counter extends Vue {
  @Prop value: number;
  @Prop add: Function;
  @Prop subtract: Function;
  @Prop disableAdd: boolean;
  @Prop disableAll: boolean;

  get addStyle() {
    return {
      'icon-add-clicked': !this.disableAdd,
      'iicon-add-unclicked': this.disableAdd,
      'disable-all': this.disableAll
    }
  }

  get subtractStyle() {
    return {
      'icon-sub-clicked': true,
      'disable-all': this.disableAll
    }
  }
}
