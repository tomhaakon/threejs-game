export class moveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot;
  }
  rotate(rotateDirection) {
    const rotationSpeed = 0.03;
    if (rotateDirection === "left") {
      this.modelRoot.rotation.y += rotationSpeed;
    } else if (rotateDirection === "right") {
      this.modelRoot.rotation.y -= rotationSpeed;
    }
  }
}
