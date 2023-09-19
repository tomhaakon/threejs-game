import * as THREE from 'three'
import * as detectIt from 'detect-it'
import nipplejs from 'nipplejs'
import { moveModel } from '../movement/moveModel' // Update this import path

export class touchControls {
  constructor(modelRoot) {
    this.modelMover = new moveModel(modelRoot) // Instantiate moveModel class
    console.log('Hei fra touchccontrols.jks')
  }
  joystick() {
    var options = {
      zone: document.getElementById('zone_joystick'),

      size: 80,
      position: { bottom: '25%', left: '50%' },
      mode: 'static',
      shape: 'circle',
      follow: false,
    }
    this.manager = nipplejs.create(options)

    this.manager.on('move', (event, data) => {
      const angle = data.angle.degree

      if (angle >= 45 && angle < 135) {
        // Move forward
        this.modelMover.move('forward')
      } else if (angle >= 225 && angle < 315) {
        // Move backward (if implemented)
        this.modelMover.move('backward')
      } else if (angle >= 135 && angle < 225) {
        // Rotate left
        this.modelMover.rotate('left')
      } else if ((angle >= 315 && angle <= 360) || (angle >= 0 && angle < 45)) {
        // Rotate right
        this.modelMover.rotate('right')
      }
    })
  }
}
