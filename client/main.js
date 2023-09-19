import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'

import { touchControls } from './js/controls/touchControls'
import { keyboard } from './js/controls/keyboard'
import { useLightHelper } from './js/lightHelper'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import * as kd from 'keydrown'
import * as detectIt from 'detect-it'
import { handleAnimation } from './js/animation/handleAnimation'
import { createGround } from './js/createGround'
//custom imports
import { sendError } from './js/errorHandler.js'
import { sendStatus } from './js/handleStatus.js'

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
  //Lighting setup

  const color = 0xffffff
  const intensity = 5
  const width = 12
  const height = 4
  const light = new THREE.RectAreaLight(color, intensity, width, height)
  light.position.set(0, 10, 0)
  light.rotation.x = THREE.MathUtils.degToRad(-90)
  scene.add(light)

  //const lightHelper = useLightHelper(light);

  //const ambientLight = new THREE.AmbientLight(0x404040);
  // scene.add(ambientLight);

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

      const mixerInfo = {
        mixer,
        actions,
        actionNdx: -1,
      }
      mixerInfos.push(mixerInfo)
      //action.play();
      mixers.push(mixer)
    })

    //!  gorund
    const groundTexture =
      'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/gr.jpg'
    new createGround(scene, groundTexture)

    //! animasjon funk
    const animate = new handleAnimation(mixerInfos)
    animate.setAnimation('Idle')

    //control
    if (detectIt.deviceType === 'mouseOnly') {
      const setKeyoard = new keyboard(
        animate.setAnimation.bind(animate),
        modelRoot
      )
      setKeyoard.controls()
    } else {
      const controls = new touchControls(modelRoot, mixerInfos)
      controls.initJoystick()
    }

    //movement
  } // FERDIG INIT

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
