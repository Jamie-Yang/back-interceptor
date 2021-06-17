const BLANK = '🅱🅻🅰🅽🅺';

export default class BackInterceptor {
  constructor() {
    this.init();
  }

  init() {
    this.handlers = [];
    this.prevId = -1;

    window.addEventListener('popstate', () => this.exec());
  }

  use(fn) {
    this.handlers.push(fn);

    history.replaceState(this.createState(), null);
    history.pushState(this.createState('blank'), null);

    return this.handlers.length - 1;
  }

  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  exec() {
    const id = this.getCurrentId();

    // 路由前进至最右
    if (id === BLANK) {
      this.prevId = -1;
      return;
    }

    const h = this.handlers[id];

    if (h === null) {
      // 跳过被eject的历史记录
      if (this.prevId > id) {
        history.back();
      } else {
        history.forward();
      }
    } else if (h) {
      h();
    }

    this.prevId = id;
  }

  getCurrentId() {
    const { state } = window.history;
    return state[state.length - 1];
  }

  createState(inBlank) {
    const ids = this.handlers.map((_h, i) => i);
    if (inBlank) {
      ids.push(BLANK);
    }
    return ids;
  }
}
