export class MovementHandler {
  constructor(modelMover) {
    this.modelMover = modelMover
    this.isMoving = false
    this.currentAnimation = null // Keep track of the current animation
  }

  handle(data) {
    if (data.leveledY <= 0) {
      this.stopMoving()
      this.isMoving = false
    } else if (data.leveledY > 0) {
      this.isMoving = true
      this.move('forward')
    }
  }

  move(direction) {
    if (!this.isMoving) {
      this.stopMoving()
      return
    }

    requestAnimationFrame(() => {
      if (this.isMoving) {
        //  this.modelMover.move(direction)
        this.move(direction)
      }
    })
  }

  stopMoving() {
    this.isMoving = false
  }
}
