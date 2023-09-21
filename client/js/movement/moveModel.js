import * as THREE from 'three'
import { handleAnimation } from '../animation/handleAnimation'
export class moveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot

    this.baseMoveSpeed = 0.05
    this.rotateSlow = 0.005
    this.rotateFast = 0.02
    this.animate = null // Initialize to null
  }
  setMixerInfos(mixerInfos) {
    this.animate = new handleAnimation(mixerInfos) // Create a new instance when needed
  }
  move(direction, throttle) {
    if (!this.modelRoot || !this.animate) return // Guard in case modelRoot or animate is not set

    const speed = this.baseMoveSpeed
    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(speed * throttle)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)

    if (direction === 'forward') {
      if (throttle === 0) {
        this.animate.setAnimation('Idle')
      } else {
        this.animate.setAnimation('Run')
        this.modelRoot.position.add(forwardVector) // Perform the move
      }
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
