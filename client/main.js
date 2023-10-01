// main.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as detectIt from 'detect-it'
import * as kd from 'keydrown'
import { FPSMeter } from './js/utils/fpsMeter' // Assuming you saved FPSMeter as a separate module

import { lightManager } from './js/enviroment/light' // fil for hjelp til å se hvor lyset kommer fra
import { touchControls } from './js/controls/touchControls' // touch
import { keyboard } from './js/controls/keyboard' // keyboard
import { createGround } from './js/enviroment/createGround' // gulv med textur
import { cameraManager } from './js/camera/cameraManager' // camera
import { modelManager } from './js/model/modelManager' // model justering
import { animationManager } from './js/animation/animationManager' // animasjoner
import { collisionManager } from './js/enviroment/collisionManager' // kollisjon til vegg
import { miniConsole } from './js/utils/miniConsole'
import SceneManager from './js/enviroment/sceneManager.js'

import { PlayerManager } from './js/modules/playerManager'
class ThreeJsGame {
  constructor() {
    //? canvas
    const sceneManager = SceneManager
    this.playerManager = new PlayerManager()
    this.scene = sceneManager.getScene()
    this.fpsMeter = new FPSMeter()
    this.miniConsole = new miniConsole()
    this.canvas = document.querySelector('#c')
    this.fps = 35

    this.canvas.width = window.innerWidth / 2
    this.canvas.height = window.innerHeight / 2
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    //this.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.renderer = this.initializeRenderer(this.canvas)
    this.pixelRatio = window.devicePixelRatio // For High-DPI Displays
    this.maxPixelRatio = 1 // Or whatever you choose

    //? loader
    const { manager, loadingElem } = this.initializeLoadingManager()
    this.loadingElem = loadingElem

    //? model
    this.modelRoot = new THREE.Object3D()
    this.animationManager = new animationManager()
    this.modelManager = new modelManager(this.animationManager)

    this.scene = this.initializeScene()
    //?
    this.collisionManager = new collisionManager()
    this.playerMesh = null
    this.wallInstance = null

    //? camera
    this.cameraManager = new cameraManager(
      this.modelRoot,
      this.scene,
      this.aspect
    )
    this.camera = this.cameraManager.getCamera()

    //? enviroment
    this.groundInstance = null

    //? light
    this.lightManager = new lightManager(this.scene)
    this.then = 0
  }

  initializeRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({ antialias: false, canvas })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    //  renderer.setPixelRatio(Math.min(this.pixelRatio, this.maxPixelRatio))
    this.updateMiniConsole('initializeRenderer')

    return renderer
  }

  initializeLoadingManager() {
    const loadingElem = document.querySelector('#loading')
    const progressbarElem = document.querySelector('#progressbar')
    const manager = new THREE.LoadingManager()
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      progressbarElem.style.width = `${((itemsLoaded / itemsTotal) * 100) | 0}%`
    }
    this.updateMiniConsole('initializeLoadingManager')

    return { manager, loadingElem }
  }

  initializeScene() {
    this.updateMiniConsole('initializeScene')

    return this.scene //
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

      // Wait for player model to load before initializing
      const playerModelLoaded = new Promise((resolve) => {
        const intervalId = setInterval(() => {
          const playerModel = this.modelManager.getPlayerMesh()
          if (playerModel) {
            clearInterval(intervalId)
            resolve(playerModel)
          }
        }, 100) // Check every 100 milliseconds
      })
      await playerModelLoaded // Wait for player model to load
      this.initGround()
      this.init()
      this.initializeScene()
    } catch (error) {
      console.error('Failed to preload resources:', error)
    }
  }
  initGround() {
    const groundTexture =
      'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/gr.jpg'

    this.groundInstance = new createGround(this.scene, groundTexture)
    this.updateMiniConsole('InitGround')
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
      //  console.log('Ground instance is available')
      this.wallInstance = this.groundInstance.getWallInstance()
    } else {
      console.error('Ground instance is not available')
    }

    //this.playerMesh = this.modelManager.getPlayerMesh()

    this.updateMiniConsole('Init')
  }
  main() {
    if (detectIt.deviceType === 'mouseOnly') {
      const setKeyboard = new keyboard(
        this.modelRoot,
        this.animationManager.getMixerInfos()
      )
      setKeyboard.controls()
    } else {
      const controls = new touchControls(
        this.modelRoot,
        this.animationManager.getMixerInfos()
      )
    }

    requestAnimationFrame(this.render.bind(this))
    this.updateMiniConsole('Main init')
  }
  updateMiniConsole(message) {
    const miniConsole = document.getElementById('rightConsole')
    const newMessage = document.createElement('div')
    newMessage.textContent = message
    miniConsole.appendChild(newMessage)

    // Auto-scroll to bottom
    miniConsole.scrollTop = miniConsole.scrollHeight
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
  update() {
    // Use a fixed delta time here
    const fixedDeltaTime = 1 / 60 // for 60 updates per second
    this.animationManager.update(fixedDeltaTime)
    this.cameraManager.updateCamera()
    this.collisionManager.checkCollisionWithWall(
      this.modelRoot.position,
      this.wallInstance
    )
  }
  render(now) {
    const fps = this.fpsMeter.update()
    this.miniConsole.update(`FPS: ${fps}`, 'Left', 'fps') // Adjust placement as needed

    kd.tick()
    now *= 0.001
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement
      const newAspect = canvas.clientWidth / canvas.clientHeight
      this.cameraManager.updateAspectRatio(newAspect)
    }
    this.playerManager.updatePlayerPosition() // Assume this method updates all players
    this.playerManager.getPlayers().forEach((player) => {
      if (!this.scene.children.includes(player.getMesh())) {
        //    this.scene.add(player.getMesh()) // Add player mesh to scene if not already present
      }
      // If you have additional per-frame update logic for players, apply it here
    })
    this.update() // call the update method with the fixed delta time
    this.renderer.render(this.scene, this.camera)

    setTimeout(() => {
      requestAnimationFrame(this.render.bind(this))
    }, 1000 / this.fps) // for 30 fps
  }
}

const game = new ThreeJsGame()
game.preload().then(() => {
  game.main()
  game.miniConsole.update('Game loaded', 'Right', 6)
  game.miniConsole.update(
    `Device: ${detectIt.deviceType}`,
    'Left',
    'deviceType'
  )
})
