// CollisionManager.js
import * as THREE from 'three'
export class collisionManager {
  constructor(modelRoot, wallMesh, radius) {
    this.modelRoot = modelRoot
    this.wallMesh = wallMesh
    this.radius = radius
  }

  checkCollisionWithWall(playerPosition, wall) {
    const wallCenter = new THREE.Vector2(0, 0)
    const playerPos = new THREE.Vector2(playerPosition.x, playerPosition.z)
    const distanceToCenter = wallCenter.distanceTo(playerPos)

    if (distanceToCenter > wall.getRadius()) {
      const direction = playerPos.sub(wallCenter).normalize()
      playerPosition.x = wallCenter.x + direction.x * wall.getRadius()
      playerPosition.z = wallCenter.y + direction.y * wall.getRadius()
    }
  }
}
