// Walls.js
import * as THREE from 'three'

export class wall {
  constructor(scene, radius, segments) {
    this.radius = radius
    this.segments = segments
    this.scene = scene
    this.wallMesh = null

    this.createWall()
  }

  createWall() {
    const wallGeometry = new THREE.RingGeometry(
      this.radius,
      this.radius + 2,
      this.segments
    )
    const wallMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.05,
    })
    this.wallMesh = new THREE.Mesh(wallGeometry, wallMaterial)
    this.wallMesh.position.y = 1
    this.wallMesh.rotation.x = -Math.PI / 2

    this.scene.add(this.wallMesh)
  }

  getMesh() {
    return this.wallMesh
  }

  getRadius() {
    return this.radius
  }
}
