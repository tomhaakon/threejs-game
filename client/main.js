import { LightManager } from './js/enviroment/light'
import { touchControls } from './js/controls/touchControls'
import { keyboard } from './js/controls/keyboard'
import { createGround } from './js/createGround'
import { handleAnimation } from './js/animation/handleAnimation'
import { CameraManager } from './js/camera/cameraManager'
import { ModelManager } from './js/ModelManager'
import { AnimationManager } from './js/animation/AnimationManager'

import { models } from './js/modelConfig'

import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import * as kd from 'keydrown'
import * as detectIt from 'detect-it'
import { sendError } from './js/errorHandler.js'
import { sendStatus } from './js/handleStatus.js'
sendError('device', detectIt.deviceType)

//? canvas
function initializeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  return renderer
}

//? loader
function initializeLoadingManager() {
  const loadingElem = document.querySelector('#loading')
  const progressbarElem = document.querySelector('#progressbar')
  const manager = new THREE.LoadingManager()
  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    progressbarElem.style.width = `${((itemsLoaded / itemsTotal) * 100) | 0}%`
  }
  return { manager, loadingElem }
}
//? scene
function initializeScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')
  return scene
}

function main() {
  const canvas = document.querySelector('#c')
  const renderer = initializeRenderer(canvas)
  const manager = initializeLoadingManager()
  const scene = initializeScene()
  //? light

  const lightManager = new LightManager(scene)
  const modelRoot = new THREE.Object3D() // a new object just for the model

  //? camera
  const aspect = canvas.clientWidth / canvas.clientHeight
  const cameraManager = new CameraManager(modelRoot, scene, aspect)
  const camera = cameraManager.getCamera() // now use this camera object in your render loop

  //? animation
  const animationManager = new AnimationManager()
  const { loadingElem } = initializeLoadingManager()
  function init(loadedModels) {
    loadingElem.style.display = 'none'

    modelManager.prepareModels()

    //?  gorund
    const groundTexture =
      'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/gr.jpg'
    new createGround(scene, groundTexture)

    modelManager.addModelsToScene(
      loadedModels,
      modelRoot,
      animationManager.getMixerInfos(),
      animationManager.getMixers(),
      scene
    )

    //? control
    if (detectIt.deviceType === 'mouseOnly') {
      const setKeyoard = new keyboard(modelRoot)
      setKeyoard.controls()
    } else {
      const controls = new touchControls(
        modelRoot,
        animationManager.getMixerInfos()
      )
    }
  }

  const modelManager = new ModelManager(models, animationManager)
  modelManager.loadAll((loadedModels) => {
    init(loadedModels)
  })

  function resizeRendererToDisplaySize(renderer) {
    //
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
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

    animationManager.update(deltaTime)

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      const newAspect = canvas.clientWidth / canvas.clientHeight
      cameraManager.updateAspectRatio(newAspect)
    }

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
  //
  sendStatus(true)
  //
}
main()
