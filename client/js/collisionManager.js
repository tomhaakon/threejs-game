// CollisionManager.js
import * as THREE from 'three'

export class CollisionManager {
  constructor(modelRoot, wallMesh, radius) {
    console.warn(radius)
    this.modelRoot = modelRoot
    this.wallMesh = wallMesh
    this.radius = radius
    //   console.log('CollisionManager.js: wallMesh, radius', wallMesh, radius)
  }

  checkBoundary(playerPosition, circleCenter) {
    //  console.log(playerPosition, circleCenter)
    const dx = playerPosition.x - circleCenter.x
    const dz = playerPosition.z - circleCenter.z
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance >= this.radius) {
      const angle = Math.atan2(dz, dx)
      playerPosition.x = circleCenter.x + Math.cos(angle) * (this.radius - 1)
      playerPosition.z = circleCenter.z + Math.sin(angle) * (this.radius - 1)
    }
    // console.log('cooolllllliiiiiide')
  }
}
