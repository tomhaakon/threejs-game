// CreateGround.js
import * as THREE from 'three'
import { Wall } from './Walls'

export class CreateGround {
  constructor(scene, textureFile, onReady) {
    this.scene = scene
    this.textureFile = textureFile
    this.radius = 100
    this.segments = 64

    this.groundMesh = null
    this.wall = new Wall(this.scene, this.radius, this.segments)

    this.onReady = onReady
    this.initGround()
    this.getGroundMesh()
  }

  initGround() {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(this.textureFile, (texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(3, 3)

      const groundGeometry = new THREE.CircleGeometry(
        this.radius,
        this.segments
      )
      const groundMaterial = new THREE.MeshStandardMaterial({ map: texture })
      this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
      this.groundMesh.receiveShadow = true
      this.groundMesh.rotation.x = -Math.PI / 2

      this.scene.add(this.groundMesh)

      if (this.onReady) {
        this.onReady()
      }
    })
  }

  getGroundMesh() {
    return this.groundMesh
  }
  getWallInstance() {
    return this.wall
  }
}
