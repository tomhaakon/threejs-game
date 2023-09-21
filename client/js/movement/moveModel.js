import * as THREE from 'three'
import { handleAnimation } from '../animation/handleAnimation'
export class moveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot
    this.state = {
      animation: 'Idle', // Start with 'Idle'
      // ... other states
    }
    this.baseMoveSpeed = 0.05
    this.rotateSlow = 0.005
    this.rotateFast = 0.02
    this.animate = null // Initialize to null

    this.addListener(this.updateState.bind(this))
  }
  updateState(newState) {
    this.state = { ...this.state, ...newState }
    if (newState.animation) {
      this.animate.setAnimation(newState.animation)
    }
  }
  addListener(callback) {
    document.addEventListener('touchend', callback)
    document.addEventListener('touchcancel', callback)
    // Your code for adding listener, maybe an event emitter or Observable
    // For this example, let's assume you would directly call `callback` when state changes
  }
  setMixerInfos(mixerInfos) {
    this.animate = new handleAnimation(mixerInfos) // Create a new instance when needed
  }
  move(throttle) {
    // console.log(throttle)
    if (!this.modelRoot || !this.animate) return

    const speed = this.baseMoveSpeed
    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(speed * throttle)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)
    let newAnimationState = this.state.animation // Use current state as default

    if (throttle >= 2) {
      // adjust this to fit your specific conditions
      newAnimationState = 'Run'
      this.modelRoot.position.add(forwardVector)
    } else {
      newAnimationState = 'Idle'
    }

    if (newAnimationState !== this.state.animation) {
      this.updateState({ animation: newAnimationState })
    }
  }

  rotate(direction) {
    //console.log('Direction:', direction)
    //console.log('rotate trigeredc')
    //  console.log(direction, level)
    if (direction === 'idle') {
      // console.log('idle')
    } else {
      if (direction === 'left-bottom') {
        this.modelRoot.rotation.y += this.rotateFast
        //  console.log('left-bottom')
      }
      if (direction === 'left-top') {
        //  console.log('left-top')

        this.modelRoot.rotation.y += this.rotateSlow
      }
      if (direction === 'right-bottom') {
        this.modelRoot.rotation.y -= this.rotateFast
        //  console.log('right-bottom')
      }
      if (direction === 'right-top') {
        this.modelRoot.rotation.y -= this.rotateSlow
        //console.log('right-top')
      }
      //  this.rotate(direction, level)
    }
  }
}
