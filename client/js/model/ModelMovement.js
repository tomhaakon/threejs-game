//MoveModel.js
import * as THREE from 'three'
import { HandleAnimation } from '../animation/HandleAnimation'

export class MoveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot
    this.state = {
      animation: 'Idle',
    }
    this.baseMoveSpeed = 0.3
    this.rotateSpeed = 0.02
  }

  setMixerInfos(mixerInfos) {
    this.animate = new HandleAnimation(mixerInfos)
  }

  move(direction, touchThrottle) {
    if (!this.modelRoot || !this.animate) return

    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(this.baseMoveSpeed)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)

    switch (direction) {
      case 'Idle':
        console.warn('Idle')
        this.animate
        break
      case 'Run':
        this.modelRoot.position.add(forwardVector)
        break
      case 'Reverse':
        this.modelRoot.position.sub(forwardVector)
        break
      case 'RotateLeft':
        this.modelRoot.rotation.y += this.rotateSpeed
        break
      case 'RotateRight':
        this.modelRoot.rotation.y -= this.rotateSpeed
        break
    }
  }
}
