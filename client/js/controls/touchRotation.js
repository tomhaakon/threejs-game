export class RotationHandler {
  constructor(modelMover, animate) {
    this.modelMover = modelMover
    this.animate = animate
    this.isRotating = false
    this.currentAnimation = null
  }

  handle(data) {
    if (data.leveledX !== 0) {
      if (data.leveledX > 0) {
        this.rotate('right')
        this.isRotating = true
      }
      if (data.leveledX <= 0) {
        this.rotate('left')
        this.isRotating = true
      }
      this.rotateAnimation(true)
    } else {
      this.stopRotating()
      this.isRotating = false
      this.rotateAnimation(false)
      return
    }
  }

  rotateAnimation(state) {
    if (state && this.isRotating) {
      if (this.currentAnimation !== 'Rotate') {
        this.animate.setAnimation('Rotate')
        this.currentAnimation = 'Rotate'
      }
    } else {
      if (this.currentAnimation !== 'Idle') {
        this.animate.setAnimation('Idle')
        this.currentAnimation = 'Idle'
      }
    }
  }

  stopRotating() {
    this.isRotating = false
    this.rotateAnimation(false)
  }

  rotate(direction) {
    if (this.isRotating) {
      requestAnimationFrame(() => {
        this.modelMover.rotate(direction, 1 / 2000)
        this.rotate(direction)
      })
    }
  }
}
