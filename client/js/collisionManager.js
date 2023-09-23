// CollisionManager.js
import * as THREE from 'three'
export class CollisionManager {
  constructor(modelRoot, wallMesh, radius) {
    this.modelRoot = modelRoot
    this.wallMesh = wallMesh
    this.radius = radius
    //   console.log('CollisionManager.js: wallMesh, radius', wallMesh, radius)
    //    console.warn(this.wallMesh)
  }

  checkCollisionWithWall(playerPosition, wall) {
    // console.warn('wall.getRadius()', wall.getRadius())
    const wallCenter = new THREE.Vector2(0, 0) // Assuming wall is at (0,0) in 2D
    const playerPos = new THREE.Vector2(playerPosition.x, playerPosition.z) // Projecting to 2D
    const distanceToCenter = wallCenter.distanceTo(playerPos)
    //   console.log(playerPos)
    // console.log(playerPosition)
    if (distanceToCenter > wall.getRadius()) {
      // Player is outside wall
      const direction = playerPos.sub(wallCenter).normalize()
      playerPosition.x = wallCenter.x + direction.x * wall.getRadius()
      playerPosition.z = wallCenter.y + direction.y * wall.getRadius()
    }
  }
}
