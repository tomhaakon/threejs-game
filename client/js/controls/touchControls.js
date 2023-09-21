import * as THREE from 'three'
import * as detectIt from 'detect-it'

import * as kd from 'keydrown'

import JoystickController from 'joystick-controller'

import { moveModel } from '../movement/moveModel' // Update this import path
import { handleAnimation } from '../animation/handleAnimation'
export class touchControls {
  constructor(modelRoot, mixerInfos) {
    this.mixerInfos = mixerInfos
    console.log(mixerInfos)

    this.modelMover = new moveModel(modelRoot)

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
        this.updateTouchZones(data)
      }
    )

    // joystick('end', () => {
    //   console.log('End')
    //   this.touchZones.leveledY = 0 // Reset to zero
    //   this.modelMover.move(0) // Move with zero throttle
    //   this.modelMover.setMixerInfos(this.mixerInfos)
    // })
  }

  updateTouchZones(data) {
    const { leveledX, leveledY } = data
    const threshold = 0.00001
    //  console.log(data)
    this.touchZones.leveledX = leveledX
    this.touchZones.leveledY = leveledY

    this.touchZones.zoneTop = leveledY > threshold
    this.touchZones.zoneBottom = leveledY < -threshold
    this.touchZones.zoneRight = leveledX > threshold
    this.touchZones.zoneLeft = leveledX < -threshold

    this.touchZones.zoneRightTop = this.touchZones.zoneRight && leveledY > 0
    this.touchZones.zoneRightBottom = this.touchZones.zoneRight && leveledY < 0

    this.touchZones.zoneLeftTop = this.touchZones.zoneLeft && leveledY > 0
    this.touchZones.zoneLeftBottom = this.touchZones.zoneLeft && leveledY < 0
  }

  performRotation() {
    //movement

    //sving venstre bunn
    if (this.touchZones.zoneLeftBottom) {
      this.direction = 'left-bottom'
      this.modelMover.rotate(this.direction)
    }
    //sving venstre top
    if (this.touchZones.zoneLeftTop) {
      this.direction = 'left-top'

      this.modelMover.rotate(this.direction)
    }
    //sving høyre bunn
    if (this.touchZones.zoneRightBottom) {
      this.direction = 'right-bottom'

      this.modelMover.rotate(this.direction)
    }
    //sving høyre level 2
    if (this.touchZones.zoneRightTop) {
      this.direction = 'right-top'
      this.modelMover.rotate(this.direction)
    }
    // gass
    if (this.touchZones.zoneTop) {
      console.log(this.touchZones.leveledY)
      this.modelMover.move(this.touchZones.leveledY)
      this.modelMover.setMixerInfos(this.mixerInfos)
    } else this.modelMover.move(0)
  }
}
