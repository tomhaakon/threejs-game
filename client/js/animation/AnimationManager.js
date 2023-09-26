// AnimationManager.js

import * as THREE from 'three'

export class animationManager {
  constructor() {
    this.mixers = []
    this.mixerInfos = []
  }

  addMixerForModel(model) {
    const mixer = new THREE.AnimationMixer(model.gltf.scene)
    const actions = Object.values(model.animations).map((clip) => {
      return mixer.clipAction(clip)
    })

    const mixerInfo = {
      mixer,
      actions,
      actionNdx: -1, //-1 er Idle animasjon
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
