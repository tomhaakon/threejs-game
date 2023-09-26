// NotifyScreen.js

export const notifyStore = new Map()

export const NotifyScreen = (name, msg) => {
  const notifyBox = document.getElementById('notifyBox')
  notifyStore.set(name, msg)

  const notifyHTML = Array.from(notifyStore.entries())
    .map(([name, msg]) => `${name}: ${msg}`)
    .join('<hr>')

  notifyBox.innerHTML = notifyHTML
}
