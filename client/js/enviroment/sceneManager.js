// SceneManager.js
import * as THREE from 'three'

class SceneManager {
  constructor() {
    if (!SceneManager.instance) {
      this.scene = new THREE.Scene()
      SceneManager.instance = this
    }
    return SceneManager.instance
  }

  getScene() {
    return this.scene
  }
}

const instance = new SceneManager()
Object.freeze(instance)

export default instance
