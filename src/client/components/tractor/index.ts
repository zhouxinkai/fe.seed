/*
* 名词解释
* Drag下拉加载
* Scroll滚动加载
 */

const TRACTOR_TOUCHING = 'tractor-touching';
const TRACTOR_LESS = 'tractor-less';
const TRACTOR_GREATER = 'tractor-greater';
const TRACTOR_REFRESHING = 'tractor-refreshing';

function constructorFunc() { };

function throttle(fn: Function, delay: number) {
  // tslint:disable-next-line:no-any
  let timer: any = null;
  // tslint:disable-next-line:no-any
  return function _(...args: any[]) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  }
}

function transformElement(el: HTMLElement, transform: string) {
  const elStyle = el.style;
  elStyle.webkitTransform = elStyle.transform = transform;
};

type TractorOptions = {
  // tslint:disable-next-line:no-any
  scroller: any,
  // 滚动容器
  openDragLoading: boolean,
  // 开启下拉加载
  openScrollLoading: boolean,
  // 开启滚动加载
  dragValve: number,
  // 下拉加载阀值
  scrollValve: number,
  // 滚动加载阀值
  onDragStart: Function,
  // 下拉开始
  onDragLessValve: Function,
  // 下拉中，但还没到刷新阀值
  onDragGreaterValve: Function,
  // 下拉中，已经达到刷新阀值
  onDragDone: Function,
  // 下拉结束
  onScroll2Valve: Function
  // 滚动到阀值
};

export default class Tractor {
  translateValue: number;
  // 下拉容器偏移值
  scrollerLoading: boolean;
  // 是否已经触发滚动加载状态
  tractor: TractorOptions;
  constructor(options: TractorOptions) {
    this.translateValue = 0;
    this.scrollerLoading = false;

    const defaults: TractorOptions = {
      scroller: 'body',
      openDragLoading: true,
      openScrollLoading: true,
      dragValve: 40,
      scrollValve: 40,
      onDragStart: constructorFunc,
      onDragLessValve: constructorFunc,
      onDragGreaterValve: constructorFunc,
      onDragDone: constructorFunc,
      onScroll2Valve: constructorFunc
    };
    this.tractor = Object.assign(defaults, options || {});
    this.tractor.scroller = document.querySelector(this.tractor.scroller);

    if (this.tractor.openDragLoading) { this.initDrag(); }
    if (this.tractor.openScrollLoading) { this.initScroll(); }
  }

  initDrag() {
    const self = this;
    const tractor = this.tractor;
    let isTouchStart = false; // 是否已经触发下拉条件
    let isDragStart = false; // 是否已经开始下拉
    let isDrag2Valve = false; // 是否下拉到阈值，用来触发 hook 的标识

    // 下拉 touchstart 时的点坐标
    let startX: number, startY: number;

    // 监听下拉
    tractor.scroller.addEventListener('touchstart', touchStart, false);
    tractor.scroller.addEventListener('touchmove', touchMove, false);
    tractor.scroller.addEventListener('touchend', touchEnd, false);

    function touchStart(event: TouchEvent) {
      // 只有当容器视图处于最顶部的时候才能触发下拉事件
      if (tractor.scroller.scrollTop <= 0) {
        isTouchStart = true;
        startX = event.touches[0].pageX;
        startY = event.touches[0].pageY;
      }
    }

    function touchMove(event: TouchEvent) {
      // Tips:
      // return false 会阻止默认事件

      if (!isTouchStart) { return; }

      // 手指在屏幕移动的距离
      const distance = event.touches[0].pageY - startY;
      if (distance > 0) {
        // 下拉时容器偏移的距离
        self.translateValue = Math.pow(event.touches[0].pageY - startY, 0.85);
      } else {
        // 为了避免多次给元素设置样式属性
        if (self.translateValue !== 0) {
          self.translateValue = 0;
          transformElement(tractor.scroller, 'translate3d(0, ' + self.translateValue + 'px, 0)');
        }
      }

      // 避免横向滑屏
      // const diffDistance = Math.abs(event.touches[0].pageX - startX) - Math.abs(event.touches[0].pageY - startY);
      // if (diffDistance > 0) return false;

      if (distance > 0) {
        event.preventDefault();
        // 触摸移动的默认行为是滚动页面

        tractor.scroller.classList.add(TRACTOR_TOUCHING);

        // 触发下拉开始 hook
        if (!isDragStart) {
          isDragStart = true;

          // hook
          tractor.onDragStart();
        }

        if (self.translateValue <= tractor.dragValve) {
          // 容器偏移值未达到下拉加载（刷新）阈值

          if (tractor.scroller.classList.contains(TRACTOR_GREATER)) { tractor.scroller.classList.remove(TRACTOR_GREATER); }
          if (!tractor.scroller.classList.contains(TRACTOR_LESS)) { tractor.scroller.classList.add(TRACTOR_LESS); }

          // 触发下拉未达到阈值状态 hook
          if (!isDrag2Valve) {
            isDrag2Valve = !isDrag2Valve;
            tractor.onDragLessValve();
          }
        } else {
          // 容器偏移值已达到下拉加载（刷新）阈值

          if (tractor.scroller.classList.contains(TRACTOR_LESS)) { tractor.scroller.classList.remove(TRACTOR_LESS); }
          if (!tractor.scroller.classList.contains(TRACTOR_GREATER)) { tractor.scroller.classList.add(TRACTOR_GREATER); }

          // 触发下拉已达到阈值状态 hook
          if (isDrag2Valve) {
            isDrag2Valve = !isDrag2Valve;
            tractor.onDragGreaterValve();
          }
        }

        transformElement(tractor.scroller, 'translate3d(0, ' + self.translateValue + 'px, 0)');
      }
    }

    function touchEnd() {
      if (!isTouchStart) { return; }

      // 下拉结束还原状态
      isDragStart = false;
      isTouchStart = false;

      tractor.scroller.classList.remove(TRACTOR_TOUCHING);

      if (self.translateValue <= tractor.dragValve) {
        tractor.scroller.classList.remove(TRACTOR_LESS);
        self.translateScroller(300, 0);
        // 300毫秒内将元素移动到原点处
      } else {
        tractor.scroller.classList.remove(TRACTOR_GREATER);
        tractor.scroller.classList.add(TRACTOR_REFRESHING);
        self.translateScroller(100, tractor.dragValve);

        // 触发下拉加载（刷新）完成 hook
        tractor.onDragDone();
      }
    }
  }

  initScroll() {
    const self = this;
    const tractor = this.tractor;

    // 监听滚动
    tractor.scroller.addEventListener('scroll', throttle(scrolling, 200), false);

    function scrolling() {
      if (self.scrollerLoading) { return; }

      const scrollerscrollHeight = tractor.scroller.scrollHeight;
      const scrollerHeight = tractor.scroller.getBoundingClientRect().height;
      const scrollerTop = tractor.scroller.scrollTop;
      const scrollValve = scrollerscrollHeight - scrollerHeight - scrollerTop;

      // 达到滚动加载阀值
      if (scrollValve <= tractor.scrollValve) {
        self.scrollerLoading = true;

        // hook
        tractor.onScroll2Valve();
      }
    }
  }

  /*
  * 在指定时间duration内将元素移动到指定位置dist
   */
  translateScroller(duration: number, dist: number) {
    const self = this;

    requestAnimationFrame(translateRAF);

    let time = 0;
    function translateRAF(timestamp: number) {
      // timestamp: 当前时间距离开始触发 requestAnimationFrame 的回调的时间。
      if (!time) time = timestamp;
      let remain = self.translateValue - self.translateValue * (timestamp - time) / duration;
      if (remain < dist) remain = self.translateValue = dist;

      transformElement(self.tractor.scroller, 'translate3d(0, ' + remain + 'px, 0)');

      if (remain > dist) requestAnimationFrame(translateRAF);
    }
  }

  dragLoadingDone() {
    this.tractor.scroller.classList.remove(TRACTOR_REFRESHING);
    this.translateScroller(300, 0);
  }

  scrollLoadingDone() {
    this.scrollerLoading = false;
  }
}

