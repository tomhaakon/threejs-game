//MoveModel.js
import * as THREE from 'three'
import { HandleAnimation } from '../animation/HandleAnimation'

export class MoveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot
    this.animationState = 'Idle'
    this.setAnimationState = false

    this.animate = null
    this.newAnimationState = ''
    this.baseMoveSpeed = 0.3
    this.rotateSpeed = 0.02
  }

  setMixerInfos(mixerInfos) {
    this.animate = new HandleAnimation(mixerInfos)
  }

  updateAnimationState() {
    if (this.newAnimationState !== this.animationState) {
      this.animationState = this.newAnimationState
    }
    this.runAnimation()
  }
  runAnimation() {
    this.animate.setAnimation(this.animationState)
    ///  console.warn(this.newAnimationState)
  }
  move(direction, touchThrottle, doublePress, runOnly) {
    if (!this.modelRoot || !this.animate) return

    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(this.baseMoveSpeed)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)
    // Idle
    if (direction === 'Idle') {
     // console.warn('Idle')
      this.newAnimationState = 'Idle'
      this.updateAnimationState()
      // Run
    } else if (direction === 'Run') {
      if (!doublePress) {
        this.newAnimationState = 'Run'
      } else {
        this.newAnimationState = 'Rotate'
      }
      this.modelRoot.position.add(forwardVector)
      // Reverse
    } else if (direction === 'Reverse') {
      if (!doublePress) {
        this.newAnimationState = 'Reverse'
      } else this.newAnimationState = 'Rotate'
      this.modelRoot.position.sub(forwardVector)
      // Rotate left
    } else if (direction === 'RotateLeft') {
      this.modelRoot.rotation.y += this.rotateSpeed
      if (runOnly) {
        this.newAnimationState = 'Run'
      } else {
        this.newAnimationState = 'Rotate'
      }
      // Rotate right
    } else if (direction === 'RotateRight') {
      this.modelRoot.rotation.y -= this.rotateSpeed
      if (runOnly) {
        this.newAnimationState = 'Run'
      } else {
        this.newAnimationState = 'Rotate'
      }
    }
    this.updateAnimationState()
  }
}
