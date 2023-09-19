export class MovementHandler {
  constructor(modelMover, animate) {
    this.modelMover = modelMover
    this.animate = animate
    this.isMoving = false
    this.force = this.force
  }
  stopMoving() {
    this.animate.setAnimation('Idle')
    this.isMoving = false
  }

  handle(data) {
    const angle = data.angle.degree
    this.force = data.force // Extract force from the data

    // Start continuous movement if the joystick is in the forward range.
    if (angle >= 295 || angle >= 0) {
      if (!this.isMoving) {
        this.isMoving = true
        this.animate.setAnimation('Run')
        this.continuousMove()
      }
    } else {
      // Stop continuous movement if the joystick is out of the forward range.
      this.isMoving = false
    }
  }

  continuousMove() {
    if (!this.isMoving) return // Break out of the loop if not moving

    // Calculate speed based on the force
    const maxMoveSpeed = 0.05
    const moveSpeed = maxMoveSpeed * this.force
    //  console.log(this.handle())
    this.modelMover.move('forward', moveSpeed)

    // Use requestAnimationFrame to repeatedly call continuousMove
    requestAnimationFrame(() => this.continuousMove())
  }
}
