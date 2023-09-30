export class FPSMeter {
  constructor() {
    this.lastTime = performance.now()
    this.frameCount = 0
    this.fps = 0
  }

  update() {
    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastTime
    this.frameCount++

    if (deltaTime >= 1000) {
      // If one second has passed
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastTime = currentTime
    }

    return this.fps
  }
}
