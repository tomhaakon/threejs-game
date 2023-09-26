// Main.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as detectIt from 'detect-it'
import * as kd from 'keydrown'

import { LightManager } from './js/enviroment/Light' // fil for hjelp til å se hvor lyset kommer fra
import { TouchControls } from './js/controls/TouchControls' // touch
import { keyboard } from './js/controls/Keyboard' // keyboard
import { CreateGround } from './js/enviroment/CreateGround' // gulv med textur
import { CameraManager } from './js/camera/CameraManager' // camera
import { ModelManager } from './js/model/ModelManager' // model justering
import { AnimationManager } from './js/animation/AnimationManager' // animasjoner
import { CollisionManager } from './js/CollisionManager' // kollisjon til vegg

import { NotifyScreen } from './js/NotifyScreen.js' // fil for kun for hjelp til debug
import { SendStatus } from './js/HandleStatus.js' // fil for debug hjelp

NotifyScreen('device', detectIt.deviceType)

class ThreeJsGame {
  constructor() {
    //? canvas
    this.canvas = document.querySelector('#c')
    this.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.renderer = this.initializeRenderer(this.canvas)

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

    //? camera
    this.cameraManager = new CameraManager(
      this.modelRoot,
      this.scene,
      this.aspect
    )
    this.camera = this.cameraManager.getCamera()

    //? enviroment
    this.groundInstance = null

    //? light
    this.lightManager = new LightManager(this.scene)
    this.then = 0
  }

  initializeRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
    scene.add(this.modelRoot)
    console.log('Scene init')

    return scene
  }

  async preload() {
    const gltfLoader = new GLTFLoader(this.manager)
    const loadedModels = {}

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
    } catch (error) {
      console.error('Failed to preload resources:', error)
    }
  }
  initGround() {
    const groundTexture =
      'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/gr.jpg'

    this.groundInstance = new CreateGround(this.scene, groundTexture)
    console.log('ground init')
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

    if (this.groundInstance) {
      console.log('Ground instance is available')
      this.wallInstance = this.groundInstance.getWallInstance()
    } else {
      console.error('Ground instance is not available')
    }

    //this.playerMesh = this.modelManager.getPlayerMesh()

    console.log('init')
  }
  main() {
    if (detectIt.deviceType === 'mouseOnly') {
      const setKeyboard = new keyboard(
        this.modelRoot,
        this.animationManager.getMixerInfos()
      )
      setKeyboard.controls()
    } else {
      const controls = new TouchControls(
        this.modelRoot,
        this.animationManager.getMixerInfos()
      )
    }
    requestAnimationFrame(this.render.bind(this))
    console.log('main method triggerd')

    SendStatus(true) // et lite ikon opp til venstre som viser at main() kjører (debug)
  }

  resizeRendererToDisplaySize(renderer) {
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
