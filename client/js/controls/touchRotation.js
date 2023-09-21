export class RotationHandler {
  constructor(modelMover) {
    this.modelMover = modelMover
  }

  handle(touchZones) {
    // console.log(touchZones)

    requestAnimationFrame(() => {
      // console.log(this.modelMover)
      if (touchZones.zoneLeft) {
        this.modelMover.rotate(touchZones)
        // console.log('move left')
      }
    })
  }
}
