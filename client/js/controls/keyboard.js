// Keyboard.js
import * as THREE from 'three'
import * as kd from 'keydrown'
import { MoveModel } from '../model/ModelMovement'

export class keyboard {
  constructor(modelRoot, mixerInfos) {
    this.modelMover = new MoveModel(modelRoot)
    this.modelRoot = modelRoot
    this.mixerInfos = mixerInfos
    this.isRunning = false
    this.keys = {
      W: false,
      A: false,
      S: false,
      D: false,
    }
  }
  handleMovement() {
    if (this.keys.W && this.keys.A) {
      this.modelMover.moveNow('ForwardLeft')
    } else if (this.keys.W && this.keys.D) {
      this.modelMover.moveNow('ForwardRight')
    } else if (this.keys.W) {
      this.modelMover.moveNow('Forward')
    } else if (this.keys.A) {
      this.modelMover.moveNow('RotateLeft')
    } else if (this.keys.D) {
      this.modelMover.moveNow('RotateRight')
    } else if (this.keys.S) {
      this.modelMover.moveNow('Reverse')
    }
  }
  handleIdle() {
    if (!Object.values(this.keys).some((val) => val)) {
      this.modelMover.moveNow('Idle')
    } else {
      this.handleMovement() // If some keys are still pressed, handle accordingly
    }
  }
  controls() {
    //set animation
    this.modelMover.setMixerInfos(this.mixerInfos)

    kd.W.down(() => {
      this.keys.W = true
      this.handleMovement()
    })
    kd.W.up(() => {
      this.keys.W = false
      this.handleIdle()
    })
    kd.A.down(() => {
      this.keys.A = true
      this.handleMovement()
    })
    kd.A.up(() => {
      this.keys.A = false
      this.handleIdle()
    })
    kd.D.down(() => {
      this.keys.D = true
      this.handleMovement()
    })
    kd.D.up(() => {
      this.keys.D = false
      this.handleIdle()
    })
    kd.S.down(() => {
      this.keys.S = true
      this.handleMovement()
    })
    kd.S.up(() => {
      this.keys.S = false
      this.handleIdle()
    })

    kd.run(() => {})
  }
}
