import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import * as kd from 'keydrown'
import * as detectIt from 'detect-it'

//custom imports
import { sendError } from './js/errorHandler.js'
import { sendStatus } from './js/handleStatus.js'

sendError('loaded', 'main.js') // send msg that main.js is loaded
sendError('device', detectIt.deviceType)

function main() {
  //
  //canvas
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })

  //loader
  const loadingElem = document.querySelector('#loading')
  const progressbarElem = document.querySelector('#progressbar')
  const manager = new THREE.LoadingManager()
  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    progressbarElem.computedStyleMap.width = `${
      ((itemsLoaded / itemsTotal) * 100) | 0
    }%`
  }

  //scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')

  //camera
  const root = new THREE.Object3D()
  const modelRoot = new THREE.Object3D() // a new object just for the model

  const fov = 45
  const aspect = 2
  const near = 0.1
  const far = 2000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

  const lookDownOffset = -8
  const offsetDistance = 50
  const heightOffset = 30

  const lookAtPosition = new THREE.Vector3(
    modelRoot.position.x,
    modelRoot.position.y - lookDownOffset,
    modelRoot.position.z
  )

  camera.position.set(
    modelRoot.position.x - offsetDistance,
    modelRoot.position.y + heightOffset,
    modelRoot.position.z - offsetDistance
  )

  camera.lookAt(lookAtPosition)

  //mixers
  const mixers = []
  let mixerInfos = []
  const moveSpeed = 0.1
  modelRoot.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
    }
  })

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object
      this.prop = prop
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`
    }
    set value(hexString) {
      this.object[this.prop].set(hexString)
    }
  }

  class DegRadHelper {
    constructor(obj, prop) {
      this.obj = obj
      this.prop = prop
    }
    get value() {
      return THREE.MathUtils.radToDeg(this.obj[this.prop])
    }
    set value(v) {
      this.obj[this.prop] = THREE.MathUtils.degToRad(v)
    }
  }
  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name)
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
    folder.add(vector3, 'y', 0, 100).onChange(onChangeFn)
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
    folder.open()
  }

  {
    const color = 0xffffff
    const intensity = 5
    const width = 12
    const height = 4
    const light = new THREE.RectAreaLight(color, intensity, width, height)
    light.position.set(0, 10, 0)
    light.rotation.x = THREE.MathUtils.degToRad(-90)
    scene.add(light)

    const helper = new RectAreaLightHelper(light)
    light.add(helper)

    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    gui.add(light, 'intensity', 0, 10, 0.01)
    gui.add(light, 'width', 0, 20)
    gui.add(light, 'height', 0, 20)
    gui
      .add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180)
      .name('x rotation')
    gui
      .add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180)
      .name('y rotation')
    gui
      .add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180)
      .name('z rotation')

    makeXYZGUI(gui, light.position, 'position')
  }

  //controls
  // const controls = new OrbitControls(camera, canvas)
  // controls.target.set(0, 5, 0)
  // controls.update()
  function createGround() {
    //
    // Load the texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('./resources/textures/gr.jpg', function (texture) {
      //
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(3, 3)

      const groundGeometry = new THREE.PlaneGeometry(100, 100)
      const groundMaterial = new THREE.MeshStandardMaterial({ map: texture })
      const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)

      groundMesh.receiveShadow = true // ground should be able to receive shadows
      groundMesh.rotation.x = -Math.PI / 2 // Rotate the ground to be horizontal
      scene.add(groundMesh)
    })
  }
  //Lighting setup
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)
  // function addLight(...pos) {
  //   const color = 0xffffff
  //   const intensity = 2.5
  //   const light = new THREE.DirectionalLight(color, intensity)
  //   light.position.set(...pos)
  //   scene.add(light)
  //   scene.add(light.target)
  // }

  function init() {
    loadingElem.style.display = 'none'

    prepModelsAndAnimations()

    Object.values(models).forEach((model, ndx) => {
      const objectScale = 13
      const clonedScene = SkeletonUtils.clone(model.gltf.scene)

      modelRoot.scale.set(objectScale, objectScale, objectScale)
      modelRoot.add(clonedScene)
      scene.add(modelRoot)

      modelRoot.position.set(ndx, ndx, ndx)
      modelRoot.rotation.y = Math.PI / 4

      const mixer = new THREE.AnimationMixer(clonedScene)
      const firstClip = Object.values(model.animations)[2]
      const action = mixer.clipAction(firstClip)
      const actions = Object.values(model.animations).map((clip) => {
        return mixer.clipAction(clip)
      })

      model.animations = {} // Resetting the animations for the model
      model.gltf.animations.forEach((clip) => {
        model.animations[clip.name] = clip
      })
      // model.traverse((node) => {
      //   if (node.isMesh) {
      //     node.material = new THREE.MeshStandardMaterial({ color: 0xffffff })
      //   }
      // })

      const mixerInfo = {
        mixer,
        actions,
        actionNdx: -1,
      }
      mixerInfos.push(mixerInfo)
      action.play()
      mixers.push(mixer)
    })

    // const light = new THREE.DirectionalLight(0xffffff, 0.5)
    // light.position.set(0, 20, 0)
    // light.target.position.set(0, 0, 0)
    // scene.add(light.target)
    // light.castShadow = true

    // renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // // Replace the problematic line with these:
    // light.shadow.camera.left = -50
    // light.shadow.camera.right = 50
    // light.shadow.camera.top = 50
    // light.shadow.camera.bottom = -50
    // light.shadow.camera.near = 0.5
    // light.shadow.camera.far = 50
    // light.shadow.camera.updateProjectionMatrix() // Important to update after setting parameters

    // light.shadow.mapSize.set(1024, 1024)
    // scene.add(light)

    // Ground creation
    createGround()

    setupKeyBindings()
    setAnimation('Idle')
  }

  //animasjon

  const models = {
    alienBug: {
      url: 'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/alien-bug.glb',
    },
  }

  const gltfLoader = new GLTFLoader(manager)
  for (const model of Object.values(models)) {
    gltfLoader.load(model.url, (gltf) => {
      gltf.scene.traverse((node) => {
        if (node.isMesh) {
          node.material = new THREE.MeshStandardMaterial({ color: 0xffffff })
        }
      })

      model.gltf = gltf
    })
  }

  manager.onLoad = () => init()

  function prepModelsAndAnimations() {
    //
    Object.values(models).forEach((model) => {
      //
      const animsByName = {}
      model.gltf.animations.forEach((clip) => {
        //
        animsByName[clip.name] = clip
        //
      })
      model.animations = animsByName
    })
  }
  let moveBackward = false // Add this variable at the beginning of your main function
  let isRunning = false
  let moveForward = false

  //keybindings
  function setupKeyBindings() {
    kd.S.down(() => {
      if (!isRunning) {
        setAnimation('Run', -1) // Pass -1 to play the animation backwards
        isRunning = true
        moveBackward = true
      }
    })
    kd.S.up(() => {
      setAnimation('Idle')
      isRunning = false
      moveForward = false // Clear the flag when W is released
    })

    kd.W.down(() => {
      if (!isRunning) {
        setAnimation('Run')
        isRunning = true

        moveForward = true // Set the flag when W is pressed
      }
    })

    kd.W.up(() => {
      setAnimation('Idle')
      isRunning = false
      moveForward = false // Clear the flag when W is released
    })
    kd.A.down(() => {
      rotateModel('left')
    })

    kd.D.down(() => {
      rotateModel('right')
    })
  }

  //rotate
  function rotateModel(direction) {
    const rotationSpeed = 0.03
    if (direction === 'left') {
      modelRoot.rotation.y += rotationSpeed
    } else if (direction === 'right') {
      modelRoot.rotation.y -= rotationSpeed
    }
  }

  function setAnimation(name) {
    mixerInfos.forEach((mixerInfo) => {
      const actions = mixerInfo.actions // renamed for clarity

      const actionToPlay = actions.find(
        (action) => action.getClip().name === name
      )

      if (actionToPlay) {
        actions.forEach((action) => action.stop()) // stop all actions
        actionToPlay.play() // play the specific action
      } else {
        console.warn(`Action "${name}" not found.`)
      }
    })
  }

  //render functinons
  function resizeRendererToDisplaySize(renderer) {
    //
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      //
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  let then = 0
  function render(now) {
    kd.tick()

    if (moveForward) {
      const direction = new THREE.Vector3(
        Math.sin(modelRoot.rotation.y),
        0,
        Math.cos(modelRoot.rotation.y)
      )
      direction.multiplyScalar(moveSpeed)
      modelRoot.position.add(direction)
    }

    // Calculate the new offset for the camera based on the model's forward direction
    const offset = new THREE.Vector3(
      -Math.sin(modelRoot.rotation.y) * offsetDistance,
      heightOffset,
      -Math.cos(modelRoot.rotation.y) * offsetDistance
    )

    camera.position.copy(modelRoot.position).add(offset)

    // Adjust camera's lookAt.
    camera.lookAt(
      modelRoot.position.x,
      modelRoot.position.y - lookDownOffset,
      modelRoot.position.z
    )

    now *= 0.001
    const deltaTime = now - then
    then = now

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    for (const { mixer } of mixerInfos) {
      mixer.update(deltaTime)
    }

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
  //
  sendStatus(true) // icon that shows that main functio is running
  //
}
main()
