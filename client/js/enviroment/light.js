// Light.js

import * as THREE from 'three'
import { UseLightHelper } from './LightHelper'
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
    const intensity = 0.001
    // const width = 12
    // const height = 4
    this.light = new THREE.DirectionalLight(color, intensity)
    this.light.position.set(0, 10, 0)
    this.light.castShadow = true // enable shadow
    //  console.log(this.light.shadow)
    this.light.shadow.mapSize.width = 1024 // or 2048, or 4096, etc.
    this.light.shadow.mapSize.height = 1024
    this.light.shadow.camera.left = -30 // or whatever value fits your needs
    this.light.shadow.camera.right = 30
    this.light.shadow.camera.top = 30
    this.light.shadow.camera.bottom = -30
    this.light.shadow.camera.near = 0.5 // or whatever value fits your needs
    this.light.shadow.camera.far = 50 // or whatever value fits your needs

    //this.light.rotation.x = THREE.MathUtils.degToRad(-90)
    this.scene.add(this.light)
    this.addSpotLight(0, 20, 0, 100, true)
    this.addSpotLight(0, 10, 0, 10, false)
    this.addSpotLight(0, 10, 0, 10, false)
    // this.addSpotLight()
  }
  addSpotLight(x, y, z, intensity, castShadow) {
    const spotlight = new THREE.SpotLight(0xffffff, intensity)
    spotlight.position.set(x, y, z)
    spotlight.castShadow = castShadow // Enable shadows for the spotlight
    //  spotlight.angle = Math.PI / 2
    spotlight.penumbra = 1
    spotlight.shadow.mapSize.width = 1024 // or 2048, or 4096, etc.
    spotlight.shadow.mapSize.height = 1024
    spotlight.shadow.camera.left = -30 // or whatever value fits your needs
    spotlight.shadow.camera.right = 20
    spotlight.shadow.camera.top = 30
    spotlight.shadow.camera.bottom = -30
    spotlight.shadow.camera.near = 0.1 // or whatever value fits your needs
    spotlight.shadow.camera.far = 50 // or whatever value fits your needs

    //this.light.rotation.x = THREE.MathUtils.degToRad(-90)
    this.scene.add(spotlight)
  }
  updateLightPosition(x, y, z) {
    this.light.position.set(x, y, z)
  }

  updateIntensity(intensity) {
    this.light.intensity = intensity
  }
}
