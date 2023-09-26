// TouchControls.js
import * as THREE from 'three'
import JoystickController from 'joystick-controller'
import { MoveModel } from '../model/ModelMovement'
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
    this.initJoystick()
    this.animate()
    this.modelMover.setMixerInfos(this.mixerInfos)
    this.modelMover.setupListeners(this.eventEmitter)
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
    //    console.log(this.mixerInfos)

    // gass
    if (this.touchStates.zoneTop && this.touchStates.leveledY >= 9) {
      /// this.modelMover.move('Run', this.touchStates)
      this.eventEmitter.emit('move', 'Run')
      this.isIdling = false
      this.setIdle = false
      this.isMoving = true

      // reverse
    } else if (this.touchStates.zoneBottom && this.touchStates.leveledY <= -7) {
      //this.modelMover.move('Reverse', this.touchStates)
      this.eventEmitter.emit('move', 'Reverse')
      this.isIdling = false
      this.setIdle = false
      this.isMoving = true
      // left
    } else if (
      this.touchStates.zoneLeft &&
      (this.touchStates.leveledY < 9 || this.touchStates.leveledY > -7)
    ) {
      this.eventEmitter.emit('move', 'RotateLeft')
      this.isIdling = false
      this.setIdle = false
      this.isMoving = true
      this.isRotating = true
      // right
    } else if (
      this.touchStates.zoneRight &&
      (this.touchStates.leveledY < 9 || this.touchStates.leveledY > -7)
    ) {
      this.eventEmitter.emit('move', 'RotateRight')
      this.isIdling = false
      this.setIdle = false
      this.isMoving = true
      this.isRotating = true
    } else {
      this.isMoving = false
      // this.isIdling = true
      if (!this.isIdling) this.checkIdle()
    }
  }
}
