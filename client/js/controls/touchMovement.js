export class MovementHandler {
  constructor(modelMover, animate) {
    this.modelMover = modelMover
    this.animate = animate
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

    if (this.currentAnimation !== 'Run') {
      this.animate.setAnimation('Run')
      this.currentAnimation = 'Run'
    }

    requestAnimationFrame(() => {
      if (this.isMoving) {
        this.modelMover.move(direction)
        this.move(direction)
      }
    })
  }

  stopMoving() {
    if (this.currentAnimation !== 'Idle') {
      this.animate.setAnimation('Idle')
      this.currentAnimation = 'Idle'
    }
    this.isMoving = false
  }
}
