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
    this.movementHandler = new MovementHandler(this.modelMover)

    this.touchZones = {
      //zones
      leveledX: 0,
      leveledY: 0,

      zoneTop: false,
      zoneBottom: false,

      zoneRight: false,
      zoneRightTop: false,
      zoneRightBottom: false,

      zoneLeft: false,
      zoneLeftTop: false,
      zoneLeftBottom: false,
    }

    this.initJoystick()
  }

  initJoystick() {
    const joystick = new JoystickController(
      {
        maxRange: 70,
        level: 10,
        radius: 50,
        joystickRadius: 30,
        opacity: 0.5,
        leftToRight: false,
        bottomToUp: true,
        containerClass: 'joystick-container',
        controllerClass: 'joystick-controller',
        joystickClass: 'joystick',
        distortion: true,
        x: '25%',
        y: '25%',
        mouseClickButton: 'ALL',
        hideContextMenu: false,
      },
      (data) => {
        this.joystickStates(data)
        this.movementHandler.handle(data)
      }
    )
  }
  joystickStates(data) {
    requestAnimationFrame(() => {
      //
      this.touchZones.leveledX = data.leveledX
      this.touchZones.leveledY = data.leveledY

      if (this.touchZones.leveledY > 0) {
        // Top
        this.touchZones.zoneTop = true
      } else this.touchZones.zoneTop = false

      if (this.touchZones.leveledY < 0) {
        // Bottom
        this.touchZones.zoneBottom = true
      } else this.touchZones.zoneBottom = false

      if (this.touchZones.leveledX > 0) {
        // Right
        this.touchZones.zoneRight = true
      } else this.touchZones.zoneRight = false

      if (this.touchZones.zoneRight && this.touchZones.leveledY < 0) {
        // Right Bottom
        this.touchZones.zoneRightBottom = true
      } else this.touchZones.zoneRightBottom = false

      if (this.touchZones.zoneRight && this.touchZones.leveledY > 0) {
        // Right Top
        this.touchZones.zoneRightTop = true
      } else this.touchZones.zoneRightTop = false

      if (this.touchZones.leveledX < 0) {
        // Left
        this.touchZones.zoneLeft = true
      } else this.touchZones.zoneLeft = false

      if (this.touchZones.zoneLeft && this.touchZones.leveledY < 0) {
        //Left Bottom
        this.touchZones.zoneLeftBottom = true
      } else this.touchZones.zoneLeftBottom = false

      if (this.touchZones.zoneLeft && this.touchZones.leveledY > 0) {
        //Left Top
        this.touchZones.zoneLeftTop = true
      } else this.touchZones.zoneLeftTop = false

      //movement

      //sving venstre level 1
      if (this.touchZones.zoneLeft || this.touchZones.zoneLeftBottom) {
        this.direction = 'left-bottom'
        this.level = 1
        this.modelMover.rotate(this.direction, this.level)
      }
      //sving venstre level 2
      if (this.touchZones.zoneLeftTop) {
        this.direction = 'left-top'
        this.level = 2
        this.modelMover.rotate(this.direction, this.level)
      }
      //sving høyre level 1
      if (this.touchZones.zoneRight || this.touchZones.zoneRightBottom) {
        this.direction = 'right-bottom'
        this.level = 1
        this.modelMover.rotate(this.direction, this.level)
      }
      //sving høyre level 2
      if (this.touchZones.zoneRightTop) {
        this.direction = 'right-top'
        this.level = 2
        this.modelMover.rotate(this.direction, this.level)
      }

      // check if throttle is let of
      if (
        this.direction !== '' &&
        (this.touchZones.leveledX === 0 || this.touchZones.leveledY === 0)
      ) {
        this.direction = 'idle'
      }

      this.modelMover.rotate(this.direction, this.level)
      // this.logger()
    })
  }
  logger() {
    console.warn('zoneRight:', this.touchZones.zoneRight)
    console.log('zoneRightTop:', this.touchZones.zoneRightTop)
    console.log('zoneRightBottom:', this.touchZones.zoneRightBottom)

    console.log('zoneLeft:', this.touchZones.zoneLeft)
    console.log('zoneLeftTop:', this.touchZones.zoneLeftTop)
    console.log('zoneLeftBottom:', this.touchZones.zoneLeftBottom)
  }
}
