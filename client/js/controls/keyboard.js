// keyboard.js
import * as THREE from 'three'
import * as kd from 'keydrown'
import { moveModel } from '../model/modelMovement'
import { eventEmitter } from './eventEmitter'

export class keyboard {
  constructor(modelRoot, mixerInfos) {
    this.modelMover = new moveModel(modelRoot)
    this.eventEmitter = new eventEmitter()
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
    this.modelMover.setupListeners(this.eventEmitter)

    kd.W.down(() => {
      this.nothingPressed = true
      this.keys.W = true

      const touchStates = {
        leveledX: 0,
        leveledY: 10,
      }
      this.eventEmitter.emit('move', 'Run', touchStates, 'keyboard')

      if (this.keys.A) {
        this.eventEmitter.emit('move', 'RotateLeft', touchStates, 'keyboard')
      }
    })
    kd.W.up(() => {
      this.runOnly = false
      this.keys.W = false
      this.nothingPressed = !this.keys.A && !this.keys.S && !this.keys.D
      this.doublePress = false
      this.checkIdle()
    })
    kd.A.down(() => {
      this.nothingPressed = false
      this.keys.A = true
      const touchStates = {
        leveledX: -10,
        leveledY: 0,
      }
      if (this.keys.W) {
        this.eventEmitter.emit('move', 'Run', touchStates, 'keyboard')
      }
      this.eventEmitter.emit('move', 'RotateLeft', touchStates, 'keyboard')
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

      const touchStates = {
        leveledX: 10,
        leveledY: 0,
      }
      this.eventEmitter.emit('move', 'RotateRight', touchStates, 'keyboard')
    })
    kd.D.up(() => {
      if (!this.keys.A && !this.keys.S && !this.keys.W) {
        this.nothingPressed = true
      }
      this.keys.D = false
      this.checkIdle()
    })
    kd.S.down(() => {
      const touchStates = {
        leveledX: 0,
        leveledY: -10,
      }
      this.eventEmitter.emit('move', 'Reverse', touchStates, 'keyboard')
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
