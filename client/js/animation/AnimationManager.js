// AnimationManager.js

import * as THREE from 'three'

export class AnimationManager {
  constructor() {
    this.mixers = []
    this.mixerInfos = []
  }

  addMixerForModel(model) {
    //   console.log('model.gltf:', model.gltf)
    // console.log('model.gltf.scene:', model.gltf?.scene)

    const mixer = new THREE.AnimationMixer(model.gltf.scene)
    const actions = Object.values(model.animations).map((clip) => {
      return mixer.clipAction(clip)
    })

    const mixerInfo = {
      mixer,
      actions,
      actionNdx: -1, // you can use this to keep track of which action is currently playing
    }

    this.mixerInfos.push(mixerInfo)
    this.mixers.push(mixer)
  }

  update(deltaTime) {
    for (const { mixer } of this.mixerInfos) {
      mixer.update(deltaTime)
    }
  }
  getMixers() {
    return this.mixers
  }

  getMixerInfos() {
    return this.mixerInfos
  }
}
