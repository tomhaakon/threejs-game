//player.js
import * as THREE from 'three'

export class Player {
  constructor(playerData) {
    this.playerData = playerData
    this.position = new THREE.Vector3() // Initialized position property

    // Initialize the player's model (this is just an example, use your actual model)
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    this.mesh = new THREE.Mesh(geometry, material)

    // Set the initial position
    this.update(this.playerData)
  }

  update(playerData) {
    // console.warn(playerData)
    playerData = playerData || {}
    const { position = {}, rotation = {} } = playerData
    const { x = 0, y = 0, z = 0 } = position

    // Proceed with the validated/adjusted data
    this.position.set(x, y, z)
    // Now, you should also apply this updated position to your mesh
    this.mesh.position.set(x, y, z)
    // ... and similarly for rotation, if you need to update it.
  }

  getMesh() {
    return this.mesh
  }
}
