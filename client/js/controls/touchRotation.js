export class RotationHandler {
  constructor(modelMover, animate) {
    this.modelMover = modelMover
    this.animate = animate
    this.isRotating = false
    this.currentAnimation = null // Keep track of the current animation
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
        // NEW
        this.animate.setAnimation('Rotate')
        this.currentAnimation = 'Rotate' // NEW
      }
    } else {
      if (this.currentAnimation !== 'Idle') {
        // NEW
        this.animate.setAnimation('Idle') // Assuming this will stop the animation
        this.currentAnimation = 'Idle' // NEW
      }
    }
  }

  stopRotating() {
    this.isRotating = false
    this.rotateAnimation(false) // Explicitly stop animation
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
