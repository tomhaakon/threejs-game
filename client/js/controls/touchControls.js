// TouchControls.js
import * as THREE from 'three'
import JoystickController from 'joystick-controller'
import { MoveModel } from '../model/ModelMovement'

export class TouchControls {
  constructor(modelRoot, mixerInfos) {
    this.mixerInfos = mixerInfos
    this.modelMover = new MoveModel(modelRoot)
    this.direction = ''

    this.isMoving = false
    this.isIdling = true
    this.setIdle = false

    this.touchStates = {
      leveledX: 0,
      leveledY: 0,

      zoneTop: false,
      zoneBottom: false,
      zoneRight: false,
      zoneLeft: false,
    }
    this.initJoystick()
    this.animate()
    this.checkIdle()
  }

  initJoystick() {
    const joystick = new JoystickController(
      {
        maxRange: 30,
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
        this.touchZones(data)

        //  console.log(data)
      }
    )
  }
  animate() {
    this.moveModel()

    requestAnimationFrame(this.animate.bind(this))

    // console.log(this.isMoving)
  }
  touchZones(data) {
    const { leveledX, leveledY } = data
    this.touchStates.leveledX = leveledX
    this.touchStates.leveledY = leveledY
    this.touchStates.zoneTop = leveledY > 0
    this.touchStates.zoneBottom = leveledY < 0
    this.touchStates.zoneLeft = leveledX < 0
    this.touchStates.zoneRight = leveledX > 0
  }
  checkIdle() {
    // console.log('checking idle')
    if (!this.setIdle && !this.isMoving) {
      this.modelMover.move('Idle', this.touchStates)
      this.setIdle = true
      this.isIdling = true
    } else {
      // this.setIdle = false
    }
  }
  moveModel() {
    this.modelMover.setMixerInfos(this.mixerInfos)
    // gass
    if (this.touchStates.zoneTop && this.touchStates.leveledY >= 7) {
      this.modelMover.move('Run', this.touchStates)
      this.isIdling = false
      this.setIdle = false
      this.isMoving = true

      // reverse
    } else if (this.touchStates.zoneBottom && this.touchStates.leveledY <= -7) {
      this.modelMover.move('Reverse', this.touchStates)
      this.isIdling = false
      this.setIdle = false
      this.isMoving = true
      // left
    } else if (
      this.touchStates.zoneLeft &&
      (this.touchStates.leveledY < 7 || this.touchStates.leveledY > -7)
    ) {
      this.modelMover.move('RotateLeft', this.touchStates)
      this.isIdling = false
      this.setIdle = false
      this.isMoving = true
      // right
    } else if (
      this.touchStates.zoneRight &&
      (this.touchStates.leveledY < 7 || this.touchStates.leveledY > -7)
    ) {
      this.modelMover.move('RotateRight', this.touchStates)
      this.isIdling = false
      this.setIdle = false
      this.isMoving = true
    } else {
      this.isMoving = false
      this.isIdling = true
      this.checkIdle()
    }
  }
}
