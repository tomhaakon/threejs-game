import * as THREE from 'three'
import * as detectIt from 'detect-it'

import * as kd from 'keydrown'
import { RotationHandler } from './touchRotation'
import { MovementHandler } from './touchMovement'
import JoystickController from 'joystick-controller'

import { moveModel } from '../movement/moveModel' // Update this import path
import { handleAnimation } from '../animation/handleAnimation'
export class touchControls {
  constructor(modelRoot, mixerInfos) {
    this.mixerInfos = mixerInfos
    this.modelMover = new moveModel(modelRoot)
    this.animate = new handleAnimation(this.mixerInfos)
    this.rotationHandler = new RotationHandler(this.modelMover)
    this.movementHandler = new MovementHandler(this.modelMover, this.animate)

    this.joystickState = {
      moving: false,
      data: null,
    }
    this.initJoystick()
  }

  initJoystick() {
    this.animate.setAnimation('Idle')

    const joystick = new JoystickController(
      {
        x: '70%',
        y: '15%',
        maxRange: 50,
      },
      (data) => this.rotationHandler.handle(data)
      //  this.movementHandler.handle(this.data)
    )

    // if ((this.joystickState.data.distance = 0)) {
    //   console.warn('hei')
    //   this.rotationHandler.handle(this.data)
    //   this.movementHandler.handle(this.data)
    // }

    // this.animate.setAnimation('Idle')
    // this.rotationHandler.stopRotating()
    // this.movementHandler.stopMoving() // Inform the MovementHandler to stop movement
  }
}
