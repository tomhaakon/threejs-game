// miniConsole.js
export class miniConsole {
  constructor() {
    this.rightConsole = document.getElementById('rightConsole')
    this.leftConsole = document.getElementById('leftConsole')
    this.messages = {}
  }

  update(message, placement, id) {
    let consoleElement
    if (placement === 'Left') {
      consoleElement = this.leftConsole
    } else {
      consoleElement = this.rightConsole
    }

    if (!this.messages[id]) {
      const newMessage = document.createElement('div')
      // Insert newMessage at the top of consoleElement
      consoleElement.insertBefore(newMessage, consoleElement.firstChild)
      this.messages[id] = newMessage
    }

    this.messages[id].textContent = message
    consoleElement.scrollTop = consoleElement.scrollHeight
  }
}
