// Keyboard.js
import * as THREE from 'three'
import * as kd from 'keydrown'
import { MoveModel } from '../model/ModelMovement'

export class keyboard {
  constructor(modelRoot, mixerInfos) {
    this.modelMover = new MoveModel(modelRoot)
    this.modelRoot = modelRoot
    this.mixerInfos = mixerInfos
    this.nothingPressed = true
    this.doublePress = false
    this.runOnly = true
    this.keys = {
      W: false,
      A: false,
      S: false,
      D: false,
    }

    //console.log(this.nothingPressed)
  }
  checkIdle() {
    if (this.nothingPressed) {
      this.modelMover.move('Idle')
      // console.warn('idle')
    } else return
  }
  controls() {
    //set animation
    this.modelMover.setMixerInfos(this.mixerInfos)
    kd.W.down(() => {
      this.runOnly = true
      this.nothingPressed = false
      this.keys.W = true
      this.doublePress = this.keys.W && (this.keys.A || this.keys.D)

      if (this.keys.W && (!this.keys.A || !this.keys.D)) {
        this.runOnly = true
      } else {
        this.runOnly = false
      }

      this.modelMover.move('Run', 10, this.doublePress, this.runOnly)
    })
    kd.W.up(() => {
      this.runOnly = false
      this.keys.W = false
      this.nothingPressed = !this.keys.A && !this.keys.S && !this.keys.D
      this.doublePress = false
      this.checkIdle()
    })
    kd.A.down(() => {
      this.runOnly = this.keys.W && (!this.keys.A || !this.keys.D)
      this.nothingPressed = false
      this.keys.A = true
      this.modelMover.move('RotateLeft')
    })
    kd.A.up(() => {
      this.keys.A = false
      if (!this.keys.W && !this.keys.S && !this.keys.D) {
        this.nothingPressed = true
      }
      this.checkIdle()
    })
    kd.D.down(() => {
      this.nothingPressed = false
      this.keys.D = true
      this.modelMover.move('RotateRight')
    })
    kd.D.up(() => {
      if (!this.keys.A && !this.keys.S && !this.keys.W) {
        this.nothingPressed = true
      }
      this.keys.D = false
      this.checkIdle()
    })
    kd.S.down(() => {
      this.runOnly = true
      this.nothingPressed = false
      this.keys.S = true
      this.doublePress = this.keys.S && (this.keys.A || this.keys.D)

      if (this.keys.S && (!this.keys.A || !this.keys.D)) {
        this.runOnly = true
      } else {
        this.runOnly = false
      }
      this.modelMover.move('Reverse', 10, this.doublePress, this.runOnly)
    })
    kd.S.up(() => {
      this.runOnly = false
      this.keys.S = false
      this.nothingPressed = !this.keys.A && !this.keys.D && !this.keys.W
      this.doublePress = false
      this.checkIdle()
    })

    kd.run(() => {
      if (
        this.keys.W === false &&
        this.keys.A === false &&
        this.keys.S === false &&
        this.keys.D === false
      ) {
        this.nothingPressed = true
      } else {
        this.nothingPressed = false
      }
    })
    this.checkIdle()
  }
}
