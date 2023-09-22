import * as THREE from 'three'
import { useLightHelper } from '../lightHelper'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'

export class LightManager {
  constructor(scene) {
    this.scene = scene
    this.light = null
    this.initLight()
  }
  initAmbient() {
    const ambientLight = new THREE.AmbientLight(0x404040)
    this.scene.add(ambientLight)
  }
  initLight() {
    const color = 0xffffff
    const intensity = 5
    const width = 12
    const height = 4
    this.light = new THREE.RectAreaLight(color, intensity, width, height)
    this.light.position.set(0, 10, 0)
    this.light.rotation.x = THREE.MathUtils.degToRad(-90)
    this.scene.add(this.light)
  }

  updateLightPosition(x, y, z) {
    this.light.position.set(x, y, z)
  }

  updateIntensity(intensity) {
    this.light.intensity = intensity
  }
}
