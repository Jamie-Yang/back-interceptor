const BOL = '🅱🅾🅻'
const EOL = '🅴🅾🅻'

export default class {
  constructor() {
    this.init()
    this.backHandler = () => this.exec()
    window.addEventListener('popstate', this.backHandler)
  }

  init() {
    window.removeEventListener('popstate', this.backHandler)
    this.queue = []
    this.index = -1
    this.fns = {}
  }

  use(fn) {
    this.index += 1
    this.fns[this.index] = fn

    if (!this.checkValid()) return

    if (!this.queue.includes(this.index)) {
      this.queue.push(this.index)

      history.replaceState(this.createState(), null)
      history.pushState(this.createState('eol'), null)
    }
  }

  exec() {
    console.log('current history state: ', history.state)

    const index = this.getCurrent()
    if (!index) return

    const fn = this.fns[index]
    fn && fn()
  }

  getCurrent() {
    const { state } = history
    const queue = state.split('→')
    return queue.pop()
  }

  createState(isEOL) {
    const queue = [BOL, ...this.queue]
    if (isEOL) {
      queue.push(EOL)
    }
    return queue.join('→')
  }

  checkValid() {
    const { state } = history
    return state === null || !state.includes(this.index)
  }
}
