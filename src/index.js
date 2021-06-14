const BOL = '🅱🅾🅻';
const EOL = '🅴🅾🅻';

export default class {
  constructor() {
    this.init();
  }

  init() {
    this.queue = [];
    this.index = -1;
    this.fns = {};
    this.backHandler = () => this.exec();
    window.removeEventListener('popstate', this.backHandler);
    window.addEventListener('popstate', this.backHandler);
  }

  use(fn) {
    this.index += 1;
    this.fns[this.index] = fn;

    if (!this.checkValid()) return;

    if (!this.queue.includes(this.index)) {
      this.queue.push(this.index);

      history.replaceState(this.createState(), null);
      history.pushState(this.createState('eol'), null);
    }

    return this.index;
  }

  eject(id) {
    const index = this.queue.findIndex(id);
    this.queue.splice(index, 1);
    this.fns[id] = null;
  }

  exec() {
    console.log('current history state: ', history.state);

    const id = this.getCurrentId();
    if (!id) return;

    const fn = this.fns[id];
    fn && fn();
  }

  getCurrentId() {
    const { state } = history;
    const queue = state.split('→');
    return queue.pop();
  }

  createState(isEOL) {
    const queue = [BOL, ...this.queue];
    if (isEOL) {
      queue.push(EOL);
    }
    return queue.join('→');
  }

  checkValid() {
    const { state } = history;
    return state === null || !state.includes(this.index);
  }
}
