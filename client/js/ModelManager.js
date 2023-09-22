// ModelManager.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class ModelManager {
  constructor(models) {
    this.models = models
    this.loadedModels = {}
    this.allLoaded = false
  }

  loadAll(onComplete) {
    const manager = new THREE.LoadingManager()
    const gltfLoader = new GLTFLoader(manager)

    let loadedCount = 0
    const targetCount = Object.keys(this.models).length

    for (const [name, modelInfo] of Object.entries(this.models)) {
      gltfLoader.load(modelInfo.url, (gltf) => {
        this.loadedModels[name] = {
          ...modelInfo,
          gltf,
        }

        loadedCount++
        if (loadedCount === targetCount) {
          this.allLoaded = true
          if (onComplete) {
            onComplete(this.loadedModels)
          }
        }
      })
    }
  }

  getModel(name) {
    if (this.allLoaded) {
      return this.loadedModels[name]
    }
    return null
  }
}
