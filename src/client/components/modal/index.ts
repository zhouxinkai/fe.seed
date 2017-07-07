// @flow
import Vue from 'vue';
import Popup from 'components/popup';
import * as classnames from 'classnames';
import Component from 'vue-class-component';
require('./index.css');

@require('./index.html')
@Component({
  components: {
    Popup,
  },
  props: {
    class: String,
    isShowCloseBtn: {
      type: Boolean,
      default: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {}
})
export default class Modal extends Vue {
  class: string;
  isShowCloseBtn: boolean;
  value: boolean;

  static eventHub: Vue;

  get klass(): string {
    return classnames('modal', this.class);
  }
  mounted() {
    Modal.eventHub = new Vue();
  }

  show() {
    this.$emit('input', true);
  }
  close() {
    if (!this.value) return;
    this.$emit('input', false);
    Modal.eventHub.$emit('modal-closed', this);
  }
  toggle(v: boolean) {
    if (typeof v !== 'undefined') {
      this.value = v;
      this.$emit('input', v);
    } else {
      this.$emit('input', !this.value);
    }
  }
};
