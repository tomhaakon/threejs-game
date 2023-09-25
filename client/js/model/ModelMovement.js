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
    this.isRotating = false
    this.isRunning = false
  }

  setMixerInfos(mixerInfos) {
    this.animate = new HandleAnimation(mixerInfos)
  }

  moveNow(direction) {
    if (!this.modelRoot || !this.animate) return
    let newState = {}

    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(this.baseMoveSpeed)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)

    switch (direction) {
      case 'Idle':
        newState.animation = 'Idle'
        this.isRunning = false
        this.isRotating = false
        break
      case 'Forward':
        newState.animation = 'Run'
        this.isRunning = true
        this.modelRoot.position.add(forwardVector)
        break
      case 'ForwardLeft':
        this.isRotating = true
        this.isRunning = true
        newState.animation = 'RotateFast'

        this.modelRoot.rotation.y += this.rotateSpeed
        this.modelRoot.position + this.rotateSpeed

        break
      case 'ForwardRight':
        this.isRotating = true
        this.isRunning = true
        newState.animation = 'RotateFast'
        this.modelRoot.rotation.y -= this.rotateSpeed
        break
      case 'Reverse':
        newState.animation = 'Reverse'
        this.isRunning = true
        this.modelRoot.position.sub(forwardVector)
        break
      case 'RotateLeft':
        this.isRunning = true
        this.isRotating = true
        newState.animation = 'Rotate'
        this.modelRoot.rotation.y += this.rotateSpeed
        break
      case 'RotateRight':
        this.isRunning = true
        this.isRotating = true
        newState.animation = 'Rotate'
        this.modelRoot.rotation.y -= this.rotateSpeed

        break
      default:
        newState.animation = 'Idle'
    }
    if (newState.animation !== this.state.animation) {
      this.state = { ...this.state, ...newState }
      this.animate.setAnimation(newState.animation)
    }
  }
}
