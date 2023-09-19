import * as THREE from 'three'
import * as detectIt from 'detect-it'
import nipplejs from 'nipplejs'
import * as kd from 'keydrown'
import { RotationHandler } from './touchRotation'
import { MovementHandler } from './touchMovement'

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

    var options = {
      zone: document.getElementById('zone_joystick'),
      restJoystick: true,
      size: 80,
      position: { bottom: '25%', left: '50%' },
      mode: 'static',
      shape: 'circle',
      follow: false,
    }
    this.manager = nipplejs.create(options) // Create the joystick manager

    this.manager.on('move', (event, data) => {
      this.rotationHandler.handle(data)
      this.movementHandler.handle(data)
    })
    // Reset flags when joystick is released
    this.manager.on('end', () => {
      this.animate.setAnimation('Idle')
      this.movementHandler.stopMoving() // Inform the MovementHandler to stop movement
    })
  }
}
