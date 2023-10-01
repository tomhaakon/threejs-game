//modelPlayer.js
export class ModelPlayer {
  constructor(x, y, z, modelManager) {
    this.x = x
    this.y = y
    this.z = z
    this.modelManager = modelManager
    this._mesh = this.initializePlayerModel()
  }

  initializePlayerModel() {
    const playerModel = this.modelManager.getPlayerMesh()
    playerModel.position.set(this.x, this.y, this.z)
    return playerModel
  }

  getMesh() {
    return this._mesh // Return the '_mesh' property
  }
}
