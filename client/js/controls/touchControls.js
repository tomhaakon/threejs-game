  // TouchControls.js
  import * as THREE from 'three'
  import JoystickController from 'joystick-controller'
  import { MoveModel } from '../model/ModelMovement'

  export class TouchControls {
    constructor(modelRoot, mixerInfos) {
      this.mixerInfos = mixerInfos
      this.modelMover = new MoveModel(modelRoot)
      this.direction = ''
      this.level = 0

      this.touchZones = {
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
      this.moveModel()

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
    }

    updateTouchZones(data) {
      const { leveledX, leveledY } = data

      this.touchZones.leveledX = leveledX // throttle X -10 0 10
      this.touchZones.leveledY = leveledY // throttle Y -10 0 10

      // gass
      this.touchZones.zoneTop = leveledY > 0 // hvis throtte er høyere enn 8
      //reverse
      this.touchZones.zoneBottom = leveledY <= -9 // hvis throttle er mindre enn -8
      //sving høyre kjapt
      this.touchZones.zoneRightTop = leveledY >= 7 && leveledX > 0
      //sving høyre tregt
      this.touchZones.zoneRightBottom = leveledY < 7 && leveledX > 0
      // sving venstre kjapt
      this.touchZones.zoneLeftTop = leveledY >= 7 && leveledX < 0
      // sving venstre tregt
      this.touchZones.zoneLeftBottom = leveledY < 7 && leveledX < 0

      this.touchZones.zoneLeft = leveledX < 0
    }

    moveModel() {
      this.modelMover.setMixerInfos(this.mixerInfos)

      //sving venstre bunn
      if (this.touchZones.zoneLeftBottom) {
        this.modelMover.moveNow('fast-left', this.touchZones)
      }
      //sving venstre top
      if (this.touchZones.zoneLeftTop) {
        this.modelMover.moveNow('slow-left', this.touchZones)
      }
      //sving høyre bunn
      if (this.touchZones.zoneRightBottom) {
        this.modelMover.moveNow('fast-right', this.touchZones)
      }
      //sving høyre level 2
      if (this.touchZones.zoneRightTop) {
        this.modelMover.moveNow('slow-right', this.touchZones)
      }
      // gass
      if (this.touchZones.zoneTop) {
        this.modelMover.moveNow('Forward', this.touchZones)
      }
      // reverse
      if (this.touchZones.zoneBottom) {
        this.modelMover.moveNow('Reverse', this.touchZones)
      }
    }
  }
