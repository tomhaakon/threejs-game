import * as THREE from 'three'
import { handleAnimation } from '../animation/handleAnimation'
export class moveModel {
  constructor(modelRoot, mixerInfos) {
    //this.mixerInfos = mixerInfos
    // console.warn(this.mixerInfos)

    this.modelRoot = modelRoot
    this.moveSpeed = 0.2 // You can adjust this speed based on your requirements
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

  rotate(rotateDirection, rotateSpeed = 0) {
    if (rotateDirection === 'left') {
      this.modelRoot.rotation.y += rotateSpeed
    } else if (rotateDirection === 'right') {
      this.modelRoot.rotation.y -= rotateSpeed
    }
  }
}
