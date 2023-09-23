import * as THREE from 'three'

export class createGround {
  constructor(scene, textureFile) {
    return new Promise((resolve) => {
      this.scene = scene
      this.textureFile = textureFile
      this.radius = 100
      this.segments = 64
      this.wallMesh = null // Initialize to null
      this.groundMesh = null // Initialize to null

      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(textureFile, (texture) => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(3, 3)

        const groundGeometry = new THREE.CircleGeometry(
          this.radius,
          this.segments
        )
        const groundMaterial = new THREE.MeshStandardMaterial({ map: texture })
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
        groundMesh.receiveShadow = true // ground should be able to receive shadows
        groundMesh.rotation.x = -Math.PI / 2 // Rotate the ground to be horizontal

        // Create circular wall
        const wallGeometry = new THREE.RingGeometry(
          this.radius,
          this.radius + 2,
          this.segments
        )

        const wallMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3,
        })
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial)
        wallMesh.position.y = 1 // Raise it a bit so it doesn't overlap with the ground
        wallMesh.rotation.x = -Math.PI / 2
        scene.add(groundMesh) // Modify this line
        scene.add(wallMesh)

        this.wallMesh = wallMesh
        this.groundMesh = groundMesh

        resolve(this)
      })
    })
  }
  getGroundMesh() {
    return this.groundMesh
  }
  getWallMesh() {
    console.log(this.wallMesh)
    return this.wallMesh
  }
  getRadius() {
    return this.radius
  }
  getCenter() {
    // console.log('this.groundMesh.position.clone()')
    // return this.groundMesh.position.clone()
    return this.radius
  }
}
