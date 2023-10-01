//playermanager.js
import { Player } from './player'

export class PlayerManager {
  constructor() {
    this.players = {}
  }

  addPlayer(id, model) {
    this.players[id] = new Player(id, model)
  }

  updatePlayerPosition(id, newPosition) {
    if (this.players[id]) {
      this.players[id].updatePosition(newPosition)
    }
  }

  removePlayer(id) {
    delete this.players[id]
  }
  getPlayers() {
    return Object.values(this.players) // Returns an array of all player objects
  }

  // Add more methods as needed
}
