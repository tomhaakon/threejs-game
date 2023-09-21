import * as THREE from 'three'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

export class Model {
  constructor(gltf, scene) {
    const clonedScene = SkeletonUtils.clone(gltf.scene)
    clonedScene.scale.set(13, 13, 13) // or any other scale you want
    this.modelRoot = new THREE.Object3D()
    this.modelRoot.add(clonedScene)
    scene.add(this.modelRoot)

    this.mixer = new THREE.AnimationMixer(clonedScene)
    const firstClip = gltf.animations[0]
    this.action = this.mixer.clipAction(firstClip)
    this.action.play()
  }
}
