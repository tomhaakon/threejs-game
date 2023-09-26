// TouchControls.js
import * as THREE from 'three'
import JoystickController from 'joystick-controller'
import { MoveModel } from '../model/modelMovement'
import { EventEmitter } from './EventEmitter'
export class TouchControls {
  constructor(modelRoot, mixerInfos) {
    this.mixerInfos = mixerInfos
    this.modelMover = new MoveModel(modelRoot)
    this.eventEmitter = new EventEmitter()
    this.direction = ''
    this.isRotating = false
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
    this.modelMover.setMixerInfos(this.mixerInfos)
    this.modelMover.setupListeners(this.eventEmitter)
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

  checkIdle() {
    if (!this.setIdle && !this.isMoving) {
      this.setIdle = true
      this.isIdling = true
      this.modelMover.move('Idle', this.touchStates)
    } else {
      // this.setIdle = false
    }
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

  moveModel() {
    let moveCommand = null
    let rotateCommand = null
    const deadZone = 3 // Adjust this value based on how wide you want the dead zone to be.

    if (this.touchStates.leveledY > 0) {
      moveCommand = 'Run'
    } else if (this.touchStates.leveledY < -7) {
      moveCommand = 'Reverse'
    }

    // Handling Rotation
    if (
      this.touchStates.zoneLeft &&
      Math.abs(this.touchStates.leveledX) > deadZone
    ) {
      rotateCommand = 'RotateLeft'
    } else if (
      this.touchStates.zoneRight &&
      Math.abs(this.touchStates.leveledX) > deadZone
    ) {
      rotateCommand = 'RotateRight'
    }

    if (moveCommand) {
      this.eventEmitter.emit('move', moveCommand, this.touchStates)
    }

    if (rotateCommand) {
      this.eventEmitter.emit('move', rotateCommand, this.touchStates)
    }

    if (moveCommand || rotateCommand) {
      this.isIdling = false
      this.setIdle = false
      this.isMoving = true
    } else {
      this.isMoving = false
      if (!this.isIdling) this.checkIdle()
    }
  }
}
