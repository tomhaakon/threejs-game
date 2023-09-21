import * as THREE from 'three'
import { handleAnimation } from '../animation/handleAnimation'
export class moveModel {
  constructor(modelRoot, mixerInfos) {
    this.modelRoot = modelRoot
    this.baseMoveSpeed = 0.001
  }

  move(direction, speed = this.moveSpeed) {
    if (!this.modelRoot) return // guard in case modelRoot is not set
    // const animate = new handleAnimation(mixerInfos)

    if (direction === 'forward') {
      const forwardDirection = new THREE.Vector3(
        Math.sin(this.modelRoot.rotation.y) * speed,
        0,
        Math.cos(this.modelRoot.rotation.y) * speed
      )
      forwardDirection.multiplyScalar(this.moveSpeed)
      // animate.setAnimation('Run')

      this.modelRoot.position.add(forwardDirection)
    } else if (direction === 'backward') {
      // animate.setAnimation('Run', -1)
      // Add logic for moving backward if required
    } else {
      // animate.setAnimation('Idle')
    }
  }

  rotate(direction, level) {
    //console.log('Direction:', direction)

    if (direction === 'idle') {
      console.log('idle')
    } else {
      if (direction === 'left-bottom') {
        this.modelRoot.rotation.y -= this.baseMoveSpeed * level
        console.log('left-bottom')
      }
      if (direction === 'left-top') {
        console.log('left-top')
        this.modelRoot.rotation.y -= this.baseMoveSpeed * level
      }
      if (direction === 'right-bottom') {
        this.modelRoot.rotation.y += this.baseMoveSpeed * level
        console.log('right-bottom')
      }
      if (direction === 'right-top') {
        this.modelRoot.rotation.y += this.baseMoveSpeed * level
        console.log('right-top')
      }
      //  this.rotate(direction, level)
    }
  }
}
