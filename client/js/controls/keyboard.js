// keyboard.js
import * as THREE from 'three'
import * as kd from 'keydrown'
import { moveModel } from '../movement/moveModel'

export class keyboard {
  constructor(modelRoot, mixerInfos) {
    this.modelMover = new moveModel(modelRoot)
    this.modelRoot = modelRoot
    this.mixerInfos = mixerInfos
    this.isRunning = false
  }

  controls() {
    //set animation
    this.modelMover.setMixerInfos(this.mixerInfos)

    kd.W.down(() => {
      this.isRunning = true
      this.modelMover.moveModelWithKeyboard('forward', this.modelRoot) //
    })
    kd.W.up(() => {
      this.isRunning = false
      this.modelMover.moveModelWithKeyboard('idle', this.modelRoot) //
    })
    kd.A.down(() => {
      if (this.isRunning) {
        this.modelMover.moveModelWithKeyboard('slow-left', this.modelRoot)
      } else {
        this.modelMover.moveModelWithKeyboard('fast-left', this.modelRoot)
      }
    })
    kd.A.up(() => {
      if (!this.isRunning) {
        this.modelMover.moveModelWithKeyboard('idle', this.modelRoot) //
      }
    })
    kd.D.down(() => {
      if (this.isRunning) {
        this.modelMover.moveModelWithKeyboard('slow-right', this.modelRoot)
      } else {
        this.modelMover.moveModelWithKeyboard('fast-right', this.modelRoot)
      }
    })
    kd.D.up(() => {
      if (!this.isRunning) {
        this.modelMover.moveModelWithKeyboard('idle', this.modelRoot) //
      }
    })
    // console.log(this.isRunning)
    // kd.A.down(() => {
    //   this.modelMover.moveModelWithKeyboard('left', this.modelRoot)
    // })
    // kd.A.up(() => {
    //   this.modelMover.moveModelWithKeyboard('idle', this.modelRoot) //
    // })

    kd.S.down(() => {})

    kd.S.up(() => {})
    kd.run(() => {})
  }
}
