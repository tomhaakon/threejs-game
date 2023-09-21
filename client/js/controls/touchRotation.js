export class RotationHandler {
  constructor(modelMover) {
    this.modelMover = modelMover
  }

  handle(touchZones) {
    if (touchZones.zoneLeft) {
      // Code to rotate left
      this.modelMover.rotate('left') // or however you wish to call it
    } else if (touchZones.zoneRight) {
      // Code to rotate right
      this.modelMover.rotate('right') // or however you wish to call it
    }
    // Add more conditions as required
  }
}
