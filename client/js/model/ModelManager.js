// ModelManager.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

export class modelManager {
  constructor(animationManger) {
    this.animationManager = animationManger
    this.loadedModels = {}
    this.models = {
      alienBug: {
        tags: ['enemy', 'alien'],
        url: 'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/alien-bug.glb',
        material: new THREE.MeshLambertMaterial({ color: 0xffffff }),
        // texture: 'https://example.com/alien-bug-texture.jpg',
        // defaultAnimation: 'Idle',
        // collisionBox: { width: 1, height: 2, depth: 1 },
        // initialPosition: { x: 0, y: 0, z: 0 },
        // initialRotation: { x: 0, y: 0, z: 0 },
        // initialScale: { x: 1, y: 1, z: 1 },
        // loop: true,
      },
    }
  }
  addModelsToScene(loadedModels, modelRoot, mixerInfos, mixers, scene) {
    Object.values(loadedModels).forEach((model, ndx) => {
      this.animationManager.addMixerForModel(model)
      const objectScale = 13
      const clonedScene = SkeletonUtils.clone(model.gltf.scene)

      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.map = null
          child.material.color.set(0xffffff)
          child.material.needsUpdate = true

          child.castShadow = true
          child.receiveShadow = true
        }
      })

      modelRoot.scale.set(objectScale, objectScale, objectScale)
      modelRoot.add(clonedScene)
      scene.add(modelRoot)

      modelRoot.position.set(ndx, ndx, ndx)
      modelRoot.rotation.y = Math.PI / 4

      const mixer = new THREE.AnimationMixer(clonedScene)
      const firstClip = Object.values(model.animations)[2]
      const action = mixer.clipAction(firstClip)
      const actions = Object.values(model.animations).map((clip) => {
        return mixer.clipAction(clip)
      })

      model.animations = {}
      model.gltf.animations.forEach((clip) => {
        model.animations[clip.name] = clip
      })

      const mixerInfo = {
        mixer,
        actions,
        actionNdx: -1,
      }
      mixerInfos.push(mixerInfo)
      //action.play()
      mixers.push(mixer)
    })
  }
  prepareModels() {
    Object.values(this.loadedModels).forEach((model) => {
      const animsByName = {}
      if (model.gltf && model.gltf.animations) {
        model.gltf.animations.forEach((clip) => {
          animsByName[clip.name] = clip
        })
        model.animations = animsByName
      }
    })
  }
  getPlayerMesh() {
    if (this.loadedModels['alienBug'] && this.loadedModels['alienBug'].gltf) {
      return this.loadedModels['alienBug'].gltf.scene
    } else {
      console.error('Player model is not loaded yet.')
      return null
    }
  }
}
