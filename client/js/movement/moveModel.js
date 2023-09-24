//moveModel.js
import * as THREE from 'three'
import { handleAnimation } from '../animation/handleAnimation'
import { touchControls } from '../controls/touchControls'

export class moveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot
    this.state = {
      animation: 'Idle', // Start with 'Idle'
      // ... other states
    }
    this.baseMoveSpeed = 0.3
    this.rotateSlow = 0.005
    this.rotateFast = 0.02
    this.animate = null // Initialize to null
    this.newAnimationState = this.state.animation
  }
  normalizeSpeed(rawSpeed, maxSpeed) {
    return (rawSpeed / maxSpeed) * this.baseMoveSpeed
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState }
    if (newState.animation) {
      this.animate.setAnimation(newState.animation)
    }
  }

  setMixerInfos(mixerInfos) {
    this.animate = new handleAnimation(mixerInfos) // Create a new instance when needed
  }
  move(throttle, rotate, touchZones) {
    const normalizedSpeed = this.normalizeSpeed(throttle, 10)
    if (!this.modelRoot || !this.animate) return
    // console.log(touchZones)
    const speed = this.baseMoveSpeed
    const forwardVector = new THREE.Vector3(0, 0, 1)
    //forwardVector.multiplyScalar(speed * throttle)
    forwardVector.multiplyScalar(normalizedSpeed)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)
    this.newAnimationState = this.state.animation // Use current state as default
    if (touchZones.zoneBottom) {
      this.newAnimationState = 'Rotate'
    } else if (throttle >= 2) {
      // adjust this to fit your specific conditions
      this.newAnimationState = 'Run'
      this.modelRoot.position.add(forwardVector)
      console.log(forwardVector)
    } else {
      this.newAnimationState = 'Idle'
    }

    if (this.newAnimationState !== this.state.animation) {
      this.updateState({ animation: this.newAnimationState })
    }
  }
  moveModelWithKeyboard(direction, modelRoot) {
    if (!this.modelRoot || !this.animate) return

    this.newAnimationState = this.state.animation // Use current state as default

    const normalizedSpeed = this.normalizeSpeed(1, 1)
    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(normalizedSpeed)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)

    if (direction === 'forward') {
      this.newAnimationState = 'Run'
      modelRoot.position.add(forwardVector)
    }
    if (direction === 'idle') {
      this.newAnimationState = 'Idle'
    }
    if (direction === 'slow-left') {
      this.modelRoot.rotation.y += this.rotateSlow
      this.newAnimationState = 'Run'
    }
    if (direction === 'fast-right') {
      this.modelRoot.rotation.y -= this.rotateFast
      this.newAnimationState = 'Rotate'
    }
    if (direction === 'fast-left') {
      this.modelRoot.rotation.y += this.rotateFast
      this.newAnimationState = 'Rotate'
    }
    if (direction === 'slow-right') {
      this.modelRoot.rotation.y -= this.rotateSlow
      this.newAnimationState = 'Run'
    }

    if (this.newAnimationState !== this.state.animation) {
      this.updateState({ animation: this.newAnimationState })
    }
  }

  rotate(direction) {
    if (direction === 'left-bottom') {
      this.modelRoot.rotation.y += this.rotateFast
      this.updateState({ animation: 'Rotate' })
    }
    if (direction === 'left-top') {
      this.modelRoot.rotation.y += this.rotateSlow
    }
    if (direction === 'right-bottom') {
      this.modelRoot.rotation.y -= this.rotateFast
      this.updateState({ animation: 'Rotate' })
      //  console.log('right-bottom')
    }
    if (direction === 'right-top') {
      this.modelRoot.rotation.y -= this.rotateSlow
      //console.log('right-top')
    }
    //  this.rotate(direction, level)
  }
}
