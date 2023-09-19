import * as THREE from 'three'
import * as detectIt from 'detect-it'
import nipplejs from 'nipplejs'
import * as kd from 'keydrown'

import { moveModel } from '../movement/moveModel' // Update this import path
import { handleAnimation } from '../animation/handleAnimation'
export class touchControls {
  constructor(modelRoot, mixerInfos) {
    this.mixerInfos = mixerInfos
    this.modelMover = new moveModel(modelRoot)
    this.animate = new handleAnimation(this.mixerInfos)
    this.joystickState = {
      moving: false,
      data: null,
    }
    this.initJoystick()
    this.run()
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
      this.joystickState.moving = true
      this.joystickState.data = data
    })
    // Reset flags when joystick is released
    this.manager.on('end', () => {
      this.animate.setAnimation('Idle')
      this.joystickState.moving = false
      this.joystickState.data = null
    })
  }
  run() {
    if (this.joystickState.moving && this.joystickState.data) {
      this.handleRotation(this.joystickState.data)
      this.handleMovement(this.joystickState.data)
    }

    requestAnimationFrame(() => this.run())
  }

  handleRotation(data) {
    const angle = data.angle.degree
    const angleInRadians = (angle * Math.PI) / 180
    const force = data.force
    const maxRotateSpeed = 0.05
    const rotateSpeed =
      maxRotateSpeed * force * Math.abs(Math.sin(angleInRadians))

    if (angle <= 45 || angle >= 315) {
      // right
      this.modelMover.rotate('right', rotateSpeed)
    } else if (angle >= 135 && angle <= 225) {
      // left
      this.modelMover.rotate('left', rotateSpeed)
    }
  }

  handleMovement(data) {
    const angle = data.angle.degree
    const angleInRadians = (angle * Math.PI) / 180
    const force = data.force
    const maxMoveSpeed = 1
    const moveSpeed = maxMoveSpeed * force * Math.abs(Math.cos(angleInRadians))

    if (angle > 45 && angle < 135) {
      // forward
      //kd.run()
      this.modelMover.move('forward')
      this.animate.setAnimation('Run')
      //this.modelMover.move('forward', moveSpeed)
    } else if (angle > 225 && angle < 315) {
      // backward
      this.modelMover.move('backward', moveSpeed)
    }
  }

  continuousMove() {
    requestAnimationFrame(() => this.continuousMove())
  }
}
