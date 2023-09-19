import * as THREE from "three";

export class moveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot;
    this.moveSpeed = 0.1; // You can adjust this speed based on your requirements
  }

  move(direction) {
    if (!this.modelRoot) return; // guard in case modelRoot is not set

    if (direction === "forward") {
      const forwardDirection = new THREE.Vector3(
        Math.sin(this.modelRoot.rotation.y),
        0,
        Math.cos(this.modelRoot.rotation.y)
      );
      forwardDirection.multiplyScalar(this.moveSpeed);
      this.modelRoot.position.add(forwardDirection);
    } else if (direction === "backward") {
      // Add logic for moving backward if required
    }
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
