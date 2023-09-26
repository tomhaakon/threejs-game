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
  move(direction) {
    if (!this.modelRoot || !this.animate) return

    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(this.baseMoveSpeed)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)

    switch (direction) {
      case 'Idle':
        this.newAnimationState = 'Idle'
        break
      case 'Run':
        this.newAnimationState = 'Run'
        this.modelRoot.position.add(forwardVector)
        break
      case 'Reverse':
        this.newAnimationState = 'Reverse'
        this.modelRoot.position.sub(forwardVector)
        break
      case 'RotateLeft':
        this.newAnimationState = 'Rotate'
        this.modelRoot.rotation.y += this.rotateSpeed
        break
      case 'RotateRight':
        this.newAnimationState = 'Rotate'
        this.modelRoot.rotation.y -= this.rotateSpeed
        break
      default:
        console.warn(`Unknown direction: ${direction}`)
    }
    this.updateAnimationState()
  }
  setupListeners(eventEmitter) {
    eventEmitter.on('move', (direction) => {
      this.move(direction)
    })
  }
}
