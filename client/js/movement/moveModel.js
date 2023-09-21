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
    this.baseMoveSpeed = 0.05
    this.rotateSlow = 0.005
    this.rotateFast = 0.02
    this.animate = null // Initialize to null
    this.newAnimationState = this.state.animation

    this.addListener(this.updateState.bind(this))
  }
  updateState(newState) {
    this.state = { ...this.state, ...newState }
    if (newState.animation) {
      this.animate.setAnimation(newState.animation)
    }
  }
  addListener(callback) {
    // Your code for adding listener, maybe an event emitter or Observable
    // For this example, let's assume you would directly call `callback` when state changes
  }
  setMixerInfos(mixerInfos) {
    this.animate = new handleAnimation(mixerInfos) // Create a new instance when needed
  }
  move(throttle, rotate, touchZones) {
    if (!this.modelRoot || !this.animate) return
    // console.log(touchZones)
    const speed = this.baseMoveSpeed
    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(speed * throttle)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)
    this.newAnimationState = this.state.animation // Use current state as default
    if (touchZones.zoneBottom) {
      this.newAnimationState = 'Rotate'
    } else if (throttle >= 2) {
      // adjust this to fit your specific conditions
      this.newAnimationState = 'Run'
      this.modelRoot.position.add(forwardVector)
    } else {
      this.newAnimationState = 'Idle'
    }

    if (this.newAnimationState !== this.state.animation) {
      this.updateState({ animation: this.newAnimationState })
    }
  }

  rotate(direction) {
    //console.log('Direction:', direction)
    //console.log('rotate trigeredc')
    //  console.log(direction, level)

    if (direction === 'idle') {
      // console.log('idle')
    } else {
      // this.updateState({ animation: 'Rotate' })
      if (direction === 'left-bottom') {
        this.modelRoot.rotation.y += this.rotateFast
        this.updateState({ animation: 'Rotate' })
        //  console.log('left-bottom')
      }
      if (direction === 'left-top') {
        //  console.log('left-top')

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
}
