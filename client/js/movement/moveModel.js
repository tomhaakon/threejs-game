import * as THREE from 'three'
import { handleAnimation } from '../animation/handleAnimation'
export class moveModel {
  constructor(modelRoot, mixerInfos) {
    this.modelRoot = modelRoot
    this.baseMoveSpeed = 0.05
    this.moveSlow = 0.01
    this.moveFast = 0.02
  }

  move(direction, throttle) {
    if (!this.modelRoot) return // guard in case modelRoot is not set
    console.log(throttle)

    if (direction === 'forward') {
      const forwardVector = new THREE.Vector3(0, 0, 1) // Assuming the model faces the negative Z direction
      forwardVector.multiplyScalar(this.baseMoveSpeed * throttle) // Scale the movement
      forwardVector.applyQuaternion(this.modelRoot.quaternion) // Rotate the direction
      this.modelRoot.position.add(forwardVector) // Perform the move
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
        this.modelRoot.rotation.y += this.moveFast
        //  console.log('left-bottom')
      }
      if (direction === 'left-top') {
        //  console.log('left-top')

        this.modelRoot.rotation.y += this.moveSlow
      }
      if (direction === 'right-bottom') {
        this.modelRoot.rotation.y -= this.moveFast
        //  console.log('right-bottom')
      }
      if (direction === 'right-top') {
        this.modelRoot.rotation.y -= this.moveSlow
        //console.log('right-top')
      }
      //  this.rotate(direction, level)
    }
  }
}
