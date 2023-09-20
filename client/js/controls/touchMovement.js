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
    this.force = data.force

    if (angle >= 295 || angle >= 0) {
      if (!this.isMoving) {
        this.isMoving = true
        this.animate.setAnimation('Run')
        this.continuousMove()
      }
    } else {
      this.isMoving = false
    }
  }

  continuousMove() {
    if (!this.isMoving) return

    const maxMoveSpeed = 0.05
    const moveSpeed = maxMoveSpeed * this.force
    //  console.log(this.handle())
    this.modelMover.move('forward', moveSpeed)

    requestAnimationFrame(() => this.continuousMove())
  }
}
