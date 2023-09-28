// main.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as detectIt from 'detect-it'
import * as kd from 'keydrown'
import socket from './js/socket'
import { Player } from './js/network/player'

import { lightManager } from './js/enviroment/light' // fil for hjelp til å se hvor lyset kommer fra
import { touchControls } from './js/controls/touchControls' // touch
import { keyboard } from './js/controls/keyboard' // keyboard
import { createGround } from './js/enviroment/createGround' // gulv med textur
import { cameraManager } from './js/camera/cameraManager' // camera
import { modelManager } from './js/model/modelManager' // model justering
import { animationManager } from './js/animation/animationManager' // animasjoner
import { collisionManager } from './js/collisionManager' // kollisjon til vegg
import { miniConsole } from './js/miniConsole'
import { notifyScreen } from './js/notifyScreen.js' // fil for kun for hjelp til debug
import { sendStatus } from './js/handleStatus.js' // fil for debug hjelp

class ThreeJsGame {
  constructor() {
    //? canvas
    this.miniConsole = new miniConsole()
    this.canvas = document.querySelector('#c')
    this.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.renderer = this.initializeRenderer(this.canvas)

    //? loader
    const { manager, loadingElem } = this.initializeLoadingManager()
    this.loadingElem = loadingElem

    //? model
    this.modelRoot = new THREE.Object3D()
    this.animationManager = new animationManager()
    this.modelManager = new modelManager(this.animationManager)
    this.playerData = this.modelRoot
    // console.log(this.modelRoot.position)
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

    //this.socket = socket
    //console.log(this.playerData)
    this.playerManager = new PlayerManager(this.playerData)
  }

  initializeRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('black')
    scene.add(this.modelRoot)
    this.updateMiniConsole('initalizeScene ')

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
      this.updateMiniConsole('Preload')
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
      console.log('Ground instance is available')
      this.wallInstance = this.groundInstance.getWallInstance()
    } else {
      console.error('Ground instance is not available')
    }

    socket.emit('playerMovement', this.playerData, (ack) => {
      if (ack) {
        console.log('Server received playerMovement event:', ack)
      } else {
        console.warn('Server did not acknowledge playerMovement event')
      }
    })
    //In your main game logic, where you handle socket events...
    socket.on('otherPlayerMovement', (playersData) => {
      Object.keys(playersData).forEach((playerId) => {
        if (playerId !== socket.id) {
          let otherPlayer = this.playerManager.getPlayerById(playerId)
          if (!otherPlayer) {
            // Create player and add their mesh to the scene
            otherPlayer = this.playerManager.updateOrCreatePlayer(
              playerId,
              playersData[playerId]
            )
            this.scene.add(otherPlayer.getMesh()) // Assuming 'this.scene' is your Three.js scene
          } else {
            // Update existing player
            otherPlayer.update(playersData[playerId])
          }
        }
      })
    })

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

class PlayerManager {
  constructor(playerData) {
    this.players = {}
    this.playerData = playerData
  }

  // Method to create or update a player
  updateOrCreatePlayer(playerId, playerData) {
    let player
    if (this.players[playerId]) {
      // If player already exists, update its data
      player = this.players[playerId]
      player.update(playerData) // Assumes that the player class has an update method.
    } else {
      // If player does not exist, create a new one
      player = new Player(playerData) // Assumes you have a Player class
      this.players[playerId] = player
    }
    return player // Returning the player object here
  }
  // Method to remove a player
  removePlayer(playerId) {
    delete this.players[playerId]
  }

  // Method to get a player by ID
  getPlayerById(playerId) {
    return this.players[playerId]
  }
}

const game = new ThreeJsGame()
game.preload().then(() => {
  game.main()
  game.miniConsole.update('Game loaded')
  game.miniConsole.update(
    `Device: ${detectIt.deviceType}`,
    'Left',
    'deviceType'
  )
})
