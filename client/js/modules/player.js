//player.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class Player {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    this.mesh = new THREE.Object3D() // Use Object3D as a placeholder
    this.mesh.position.set(x, y, z)
    this.mesh.scale.set(13, 13, 13)
    const loader = new GLTFLoader()

    loader.load(
      'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/alien-bug.glb', // replace this with the path to your model
      (gltf) => {
        // called when the resource is loaded
        this.mesh.add(gltf.scene)
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the model', error)
      }
    )
    console.log('ModelPlayer created with position:', x, y, z)
  }

  setPosition(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    this.mesh.position.set(x, y, z)
  }

  getPosition() {
    return { x: this.x, y: this.y, z: this.z }
  }

  getMesh() {
    return this.mesh
  }
}
