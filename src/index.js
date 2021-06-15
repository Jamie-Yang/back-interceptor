const BLANK = '🅱🅻🅰🅽🅺';

export default class {
  constructor() {
    this.init();
  }

  init() {
    this.queue = [];
    this.index = -1;
    this.fns = {};
    this.prevId = -1;
    this.backHandler = () => this.exec();
    window.removeEventListener('popstate', this.backHandler);
    window.addEventListener('popstate', this.backHandler);
  }

  use(fn) {
    this.index += 1;
    const id = String(this.index);

    this.fns[id] = fn;

    // if (!this.checkValid()) return;

    if (!this.queue.includes(id)) {
      this.queue.push(id);

      history.replaceState(this.createState(), null);
      history.pushState(this.createState('blank'), null);
    }

    return id;
  }

  eject(id) {
    const { state } = history;
    const queue = state.split('→');
    console.log(queue);

    const index = this.queue.findIndex((_id) => id === _id);

    const leftQueue = this.queue.slice(index + 1);
    console.log(leftQueue);

    this.queue.splice(index, 1);
    this.fns[id] = 'pass';
  }

  exec() {
    console.log('current history state: ', history.state);

    const id = this.getCurrentId();
    if (!id) return;

    const fn = this.fns[id];

    if (fn === 'pass') {
      const prevIndex = this.queue.findIndex((_id) => this.prevId === _id);
      const curIndex = this.queue.findIndex((_id) => id === _id);
      if (prevIndex > curIndex) {
        history.back();
      } else {
        history.forward();
      }
    } else {
      fn && fn();
    }

    this.prevId = id;
  }

  getCurrentId() {
    const { state } = history;
    const queue = state.split('→');
    return queue.pop();
  }

  createState(inBlank) {
    const queue = [...this.queue];
    if (inBlank) {
      queue.push(BLANK);
    }
    return queue.join('→');
  }

  checkValid() {
    const { state } = history;
    return state === null || !state.includes(this.id);
  }
}
