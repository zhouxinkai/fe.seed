import Vue from 'vue';
import * as classnames from 'classnames';
import Component from 'vue-class-component';
import { Prop } from 'utils';
require('./index.css');

@require('./index.html')
@Component
export default class Popup extends Vue {
  @Prop className: string;
  @Prop clear: Function; // 关掉弹窗后的回调
  @Prop pop: boolean; // 若想 popup 默认打开，传递 pop = true
  @Prop ignoreCorner: boolean; // 不显示默认关闭按钮
  @Prop top: boolean; // 若想把内容位置放在上方，设置此属性

  id = `popup${Math.floor(Math.random() * 100000)}`;

  get klass(): string {
    return classnames(this.className, 'popup');
  }

  get contentStyle() {
    const style = {
      'popup-inner': true
    } as {[k: string]: boolean}

    if (this.top) {
      style.top = true
    }

    return style
  }

  mounted() {
    if (this.pop) this.open();
  }

  opened = false;

  open() {
    if (!this.opened) this.opened = true;
  }

  close() {
    if (this.opened) {
      this.opened = false;
      this.clear && this.clear();
    }
  }
}

/**
 * porps 设置 Component 的属性
 * options 设置 Popup 的属性
 */
export function popup(Component: typeof Vue, props = {}, options = {}) {
  let div = document.createElement('div');
  let pop = new Popup({
    propsData: {
      pop: true,
      ...options
    },
  });

  document.body.appendChild(div);

  pop.$mount(div).$nextTick(() => {
    let component = new Component({
      propsData: {
        ...props,
        close: pop.close
      }
    });
    component.$mount('#' + pop.id);
  });
}
