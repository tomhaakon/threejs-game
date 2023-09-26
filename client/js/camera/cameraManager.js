//CameraManager.js
import * as THREE from 'three'

export class CameraManager {
  constructor(modelRoot, scene, aspect) {
    this.modelRoot = modelRoot
    this.scene = scene
    this.fov = 45
    this.aspect = aspect
    this.near = 0.1
    this.far = 2000
    this.lookDownOffset = -8
    this.offsetDistance = 50
    this.heightOffset = 30
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.aspect,
      this.near,
      this.far
    )
    this.updateCamera()
  }

  updateCamera() {
    const offset = new THREE.Vector3(
      -Math.sin(this.modelRoot.rotation.y) * this.offsetDistance,
      this.heightOffset,
      -Math.cos(this.modelRoot.rotation.y) * this.offsetDistance
    )

    this.camera.position.copy(this.modelRoot.position).add(offset)

    this.camera.lookAt(
      this.modelRoot.position.x,
      this.modelRoot.position.y - this.lookDownOffset,
      this.modelRoot.position.z
    )
  }
  updateAspectRatio(newAspect) {
    this.camera.aspect = newAspect
    this.camera.updateProjectionMatrix()
  }
  getCamera() {
    return this.camera
  }
}
