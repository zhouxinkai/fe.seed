import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'utils'
import { popup } from 'components/popup'

require('./index.css')

@require('./index.html')
@Component
export default class Confirm extends Vue {
  @Prop title: string
  @Prop onOK: Function
  @Prop onCancle: Function
  @Prop close: Function;

  _onOK() {
    this.onOK && this.onOK();
    this.close && this.close();
  }

  _onCancle() {
    this.onCancle && this.onCancle;
    this.close && this.close();
  }
}

export function popupConfirm(props = {}) {
  popup(Confirm, props, {ignoreCorner: true})
}
