// main.js
import { LightManager } from './js/enviroment/light'
import { touchControls } from './js/controls/touchControls'
import { keyboard } from './js/controls/keyboard'
import { createGround } from './js/createGround'
import { handleAnimation } from './js/animation/handleAnimation'
import { CameraManager } from './js/camera/cameraManager'
import { ModelManager } from './js/ModelManager'
import { AnimationManager } from './js/animation/AnimationManager'
import { CollisionManager } from './js/CollisionManager'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import * as kd from 'keydrown'
import * as detectIt from 'detect-it'
import { sendError } from './js/errorHandler.js'
import { sendStatus } from './js/handleStatus.js'
sendError('device', detectIt.deviceType)

class ThreeJsGame {
  constructor() {
    //? canvas
    this.canvas = document.querySelector('#c')
    this.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.renderer = this.initializeRenderer(this.canvas)

    // this.manager = manager
    //this.manager = this.initializeLoadingManager()
    //? loader
    const { manager, loadingElem } = this.initializeLoadingManager()
    this.loadingElem = loadingElem

    //? model
    this.modelRoot = new THREE.Object3D()
    this.animationManager = new AnimationManager()
    this.modelManager = new ModelManager(this.animationManager)

    this.scene = this.initializeScene()
    //?
    this.collisionManager = new CollisionManager()
    this.playerMesh = null
    this.wallInstance = null

    //?light
    this.lightManager = new LightManager(this.scene)
    this.then = 0 // For your render loop

    //? camera
    this.cameraManager = new CameraManager(
      this.modelRoot,
      this.scene,
      this.aspect
    )
    this.camera = this.cameraManager.getCamera()

    this.groundInstance = null
    // this.collisionManager = new CollisionManager()
  }

  initializeRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
    renderer.shadowMap.enabled = true // enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // default shadow type
    console.log('Renderer init')
    return renderer
  }

  initializeLoadingManager() {
    const loadingElem = document.querySelector('#loading')
    const progressbarElem = document.querySelector('#progressbar')
    const manager = new THREE.LoadingManager()
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      progressbarElem.style.width = `${((itemsLoaded / itemsTotal) * 100) | 0}%`
    }
    console.log('LoadingManager init')
    return { manager, loadingElem }
  }

  initializeScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('black')
    console.log('Scene init')
    console.log('Model Root:', this.modelRoot)
    scene.add(this.modelRoot)

    return scene
  }

  async preload() {
    const gltfLoader = new GLTFLoader(this.manager)
    let loadedModels = {}

    const modelInfoList = Object.entries(this.modelManager.models)
    const modelPromises = modelInfoList.map(
      ([name, modelInfo]) =>
        new Promise((resolve, reject) => {
          gltfLoader.load(
            modelInfo.url,
            (gltf) => {
              loadedModels[name] = {
                ...modelInfo,
                gltf,
              }
              resolve()
            },
            undefined,
            () => {
              reject(new Error(`Failed to load model: ${name}`))
            }
          )
        })
    )
    try {
      await Promise.all(modelPromises)
      this.modelManager.loadedModels = loadedModels
      this.initGround()
      this.init()
      // console.warn(this.groundInstance.getWallMesh())
      // console.log('All models loaded')
    } catch (error) {
      console.error('Failed to preload resources:', error)
    }
  }
  initGround() {
    const groundTexture =
      'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/gr.jpg'

    this.groundInstance = new createGround(this.scene, groundTexture)

    console.log('ground init')
    //this.groundInstance = ground
  }

  init() {
    this.loadingElem.style.display = 'none'
    this.modelManager.prepareModels()

    this.modelManager.addModelsToScene(
      this.modelManager.loadedModels,
      this.modelRoot,
      this.animationManager.getMixerInfos(),
      this.animationManager.getMixers(),
      this.scene
    )
    if (detectIt.deviceType === 'mouseOnly') {
      const setKeyboard = new keyboard(this.modelRoot)
      setKeyboard.controls()
    } else {
      const controls = new touchControls(
        this.modelRoot,
        this.animationManager.getMixerInfos()
      )
    }
    if (this.groundInstance) {
      console.log('Ground instance is available')
      this.wallInstance = this.groundInstance.getWallInstance()
    } else {
      console.error('Ground instance is not available')
    }
    // console.warn(this.wallInstance)
    // this.wallInstance = this.groundInstance.getWallInstance()
    this.playerMesh = this.modelManager.getPlayerMesh()
   // this.modelRoot.add(this.playerMesh)

    console.log('init')
  }
  main() {
    console.log('main method triggerd')
    requestAnimationFrame(this.render.bind(this))
    //console.log(this.groundInstance)
    sendStatus(true)
  }

  resizeRendererToDisplaySize(renderer) {
    //console.log('render to displaysize')
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }
  render(now) {
    kd.tick()
    now *= 0.001
    const deltaTime = now - this.then
    this.then = now
    this.animationManager.update(deltaTime)
    this.cameraManager.updateCamera()
    //   console.log(this.playerMesh)
    // console.warn('asdasd', this.wallInstance.getRadius())
    // console.log(this.playerMesh.position)
    // console.warn(this.playerMesh.children[0].children[0].position)
    this.collisionManager.checkCollisionWithWall(
      this.modelRoot.position,
      this.wallInstance
    )

    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement
      const newAspect = canvas.clientWidth / canvas.clientHeight
      this.cameraManager.updateAspectRatio(newAspect)
    }

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }
}

const game = new ThreeJsGame()
game.preload().then(() => {
  game.main()
})
