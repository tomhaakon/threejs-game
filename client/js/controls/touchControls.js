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

    this.rotationHandler = new RotationHandler(this.modelMover)
    this.movementHandler = new MovementHandler(this.modelMover)

    this.direction = ''
    this.level = 0

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
    this.animate()
  }
  animate() {
    // Perform rotation and movement logic
    this.performRotation()

    // Call the next frame
    requestAnimationFrame(this.animate.bind(this))
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
    this.updateTouchZones(data)
    this.movementHandler.handle(this.touchZones)
    this.rotationHandler.handle(this.touchZones)
  }

  updateTouchZones(data) {
    const { leveledX, leveledY } = data

    this.touchZones.leveledX = leveledX
    this.touchZones.leveledY = leveledY

    this.touchZones.zoneTop = leveledY > 0
    this.touchZones.zoneBottom = leveledY < 0
    this.touchZones.zoneRight = leveledX > 0
    this.touchZones.zoneLeft = leveledX < 0

    this.touchZones.zoneRightTop = this.touchZones.zoneRight && leveledY > 0
    this.touchZones.zoneRightBottom = this.touchZones.zoneRight && leveledY < 0

    this.touchZones.zoneLeftTop = this.touchZones.zoneLeft && leveledY > 0
    this.touchZones.zoneLeftBottom = this.touchZones.zoneLeft && leveledY < 0
  }

  performRotation() {
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

    // this.logger()

    if (
      this.direction !== '' &&
      (this.touchZones.leveledX === 0 || this.touchZones.leveledY === 0)
    ) {
      this.direction = 'idle'
      this.level = 0
    }
    // console.log(this.direction)

    if (this.direction && this.level) {
      this.modelMover.rotate(this.direction, this.level)
    } else {
    }
  }
}
