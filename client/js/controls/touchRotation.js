export class RotationHandler {
  constructor(modelMover) {
    this.modelMover = modelMover
  }

  handle(data) {
    const angle = data.angle.degree
    const angleInRadians = (angle * Math.PI) / 180
    const force = data.force
    const maxRotateSpeed = 0.01
    const rotateSpeed = maxRotateSpeed * Math.abs(Math.sin(angleInRadians))

    if ((angle >= 0 && angle <= 70) || angle >= 270) {
      this.modelMover.rotate('right', rotateSpeed)
    }
    if (angle >= 110 && angle <= 270) {
      this.modelMover.rotate('left', rotateSpeed)
    }
  }
}
