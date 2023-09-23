import * as THREE from 'three'

export class createGround {
  //
  constructor(scene, textureFile) {
    //
    this.scene = scene
    this.textureFile = textureFile

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(textureFile, (texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(3, 3)

      const groundGeometry = new THREE.PlaneGeometry(100, 100)
      const groundMaterial = new THREE.MeshStandardMaterial({ map: texture })
      const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)

      //  console.log(groundMesh)
      groundMesh.receiveShadow = true // ground should be able to receive shadows
      groundMesh.rotation.x = -Math.PI / 2 // Rotate the ground to be horizontal
      scene.add(groundMesh) // Modify this line
    })
  }
  getGroundMesh() {
    return this.groundMesh
  }
}
