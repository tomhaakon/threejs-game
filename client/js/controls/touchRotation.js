export class RotationHandler {
  constructor(modelMover) {
    this.modelMover = modelMover
    this.isRotating = false // Track if we are currently rotating
    this.rotationDirection = null // Track the current rotation direction
    this.baseSpeedSetting = 0.0001
    this.speedMultiplier = 1 // Adjust this value to your preference
    this.joystickEngagedThreshold = 0.1 // Threshold to consider joystick as engaged
  }

  handle(data) {
    const radianAngle = Math.atan2(data.y, data.x)
    const angle = (radianAngle * (180 / Math.PI) + 360) % 360

    // Compute rotation speed based on joystick's vertical position
    // The multiplier ensures the speed increases as the joystick moves downwards
    const computedSpeed =
      this.baseSpeedSetting * (1 - data.y) * this.speedMultiplier

    // Update isRotating based on joystick's distance from center
    this.isRotating = parseFloat(data.distance) > this.joystickEngagedThreshold

    if (this.isRotating) {
      if ((angle >= 0 && angle <= 85) || angle >= 275) {
        this.rotationDirection = 'left'
        this.continuousRotate(computedSpeed)
      } else if (angle >= 95 && angle <= 265) {
        this.rotationDirection = 'right'
        this.continuousRotate(computedSpeed)
      } else {
        this.stopRotating()
      }
    } else {
      this.stopRotating()
    }
  }

  stopRotating() {
    this.isRotating = false
    this.rotationDirection = null
  }

  continuousRotate(rotateSpeed = this.baseSpeedSetting) {
    if (!this.isRotating) return

    if (this.rotationDirection === 'right') {
      this.modelMover.rotate('right', rotateSpeed)
    } else if (this.rotationDirection === 'left') {
      this.modelMover.rotate('left', rotateSpeed)
    } else {
      this.modelMover.rotate('')
    }

    // Use requestAnimationFrame to repeatedly call continuousRotate
    requestAnimationFrame(() => this.continuousRotate(rotateSpeed))
  }
}
