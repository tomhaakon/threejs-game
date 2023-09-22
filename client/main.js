import { LightManager } from './js/enviroment/light'
import { touchControls } from './js/controls/touchControls'
import { keyboard } from './js/controls/keyboard'
import { createGround } from './js/createGround'
import { handleAnimation } from './js/animation/handleAnimation'
import { CameraManager } from './js/camera/cameraManager'
import { ModelManager } from './js/ModelManager'

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import * as kd from 'keydrown'
import * as detectIt from 'detect-it'
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
    progressbarElem.style.width = `${((itemsLoaded / itemsTotal) * 100) | 0}%`
  }

  //scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')

  //light

  const lightManager = new LightManager(scene)

  const modelRoot = new THREE.Object3D() // a new object just for the model

  //camera

  const aspect = canvas.clientWidth / canvas.clientHeight
  const cameraManager = new CameraManager(modelRoot, scene, aspect)
  const camera = cameraManager.getCamera() // now use this camera object in your render loop

  //mixers

  const mixers = []
  let mixerInfos = []

  modelRoot.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
    }
  })

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

    //animate.setAnimation('Idle')

    //control
    if (detectIt.deviceType === 'mouseOnly') {
      const setKeyoard = new keyboard(modelRoot)
      setKeyoard.controls()
    } else {
      const controls = new touchControls(modelRoot, mixerInfos)
    }
  }

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

  const modelManager = new ModelManager(models)
  modelManager.loadAll((loadedModels) => {
    // Now all your models are loaded and stored in loadedModels.
    // You can proceed to use them in your scene.
    init()
  })
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
    cameraManager.updateCamera()

    now *= 0.001
    const deltaTime = now - then
    then = now

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      const newAspect = canvas.clientWidth / canvas.clientHeight
      cameraManager.updateAspectRatio(newAspect)
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
