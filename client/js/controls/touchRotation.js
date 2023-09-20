export class RotationHandler {
  constructor(modelMover) {
    this.modelMover = modelMover
    this.isRotating = false // Track if we are currently rotating
    this.rotationDirection = null // Track the current rotation direction
    this.rotateSpeed = 0
  }

  handle(data) {
    const angle = data.angle.degree
    const angleInRadians = (angle * Math.PI) / 180
    const force = data.force
    const maxRotateSpeed = 0.01
    this.rotateSpeed = maxRotateSpeed * Math.abs(Math.cos(angleInRadians) / 2)

    if ((angle >= 0 && angle <= 50) || angle >= 270) {
      if (!this.isRotating || this.rotationDirection !== 'right') {
        this.stopRotating()
        this.isRotating = true
        this.rotationDirection = 'right'
        this.continuousRotate()
      }
    } else if (angle >= 130 && angle <= 270) {
      if (!this.isRotating || this.rotationDirection !== 'left') {
        this.stopRotating()
        this.isRotating = true
        this.rotationDirection = 'left'
        this.continuousRotate()
      }
    } else {
      this.stopRotating()
    }
  }

  stopRotating() {
    this.isRotating = false
    this.rotationDirection = null
  }

  continuousRotate() {
    if (!this.isRotating) return

    if (this.rotationDirection === 'right') {
      this.modelMover.rotate('right', this.rotateSpeed)
    } else if (this.rotationDirection === 'left') {
      this.modelMover.rotate('left', this.rotateSpeed)
    }

    // Use requestAnimationFrame to repeatedly call continuousRotate
    requestAnimationFrame(() => this.continuousRotate())
  }
}
