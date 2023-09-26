// eventEmitter.js
export class eventEmitter {
  constructor() {
    this.events = {}
  }

  on(event, listener) {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = []
    }
    this.events[event].push(listener)
  }

  emit(event, ...args) {
    if (typeof this.events[event] === 'object') {
      const listeners = [...this.events[event]]
      for (let i = 0; i < listeners.length; i++) {
        listeners[i].apply(this, args)
      }
    }
  }
}
