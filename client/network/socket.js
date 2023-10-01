//socket.js
import { io } from 'socket.io-client'
import { PlayerManager } from '../js/modules/playerManager.js'
import { Player } from '../js/modules/player.js'
import SceneManager from '../js/enviroment/sceneManager.js'
import { modelManager } from '../js/model/modelManager.js'
import { ModelPlayer } from '../js/modules/modelPlayer.js'
import { miniConsole } from '../js/utils/miniConsole.js'

const miniConsoleInstance = new miniConsole()
const playerManager = new PlayerManager()
const modelMng = new modelManager()

const scene = SceneManager.getScene()

const otherPlayers = new Map()

export const socket = io.connect('http://localhost:3000')

socket.on('connect', async () => {
  console.warn('Connected to the server')
})

socket.on('userCountUpdate', (userCount) => {
  miniConsoleInstance.update(`Connected Users: ${userCount}`, 'Left')
})

// Handling new player connection
socket.on('newPlayer', (playerData) => {
  if (
    playerData.socketId !== socket.id &&
    !otherPlayers.has(playerData.socketId)
  ) {
    const newPlayer = new Player(playerData.x, playerData.y, playerData.z)
    scene.add(newPlayer.getMesh())
    otherPlayers.set(playerData.socketId, newPlayer)
  }
})
// Handling player disconnection
socket.on('playerDisconnected', (disconnectedSocketId) => {
  const disconnectedPlayer = otherPlayers.get(disconnectedSocketId)
  if (disconnectedPlayer) {
    scene.remove(disconnectedPlayer.getMesh())
    otherPlayers.delete(disconnectedSocketId)
  }
})

socket.on('playerPosition', (position) => {
  // Update player position
  const player = playerManager.getPlayer(socket.id)
  player.setPosition(position.x, position.y, position.z)
  socket.emit('updatePlayer', player.getPosition())
})

// Handling position updates from server
socket.on('updatePlayers', (playersData) => {
  // Check if playersData is a non-null object before proceeding
  if (playersData && typeof playersData === 'object') {
    Object.entries(playersData).forEach(([socketId, playerData]) => {
      if (socketId !== socket.id) {
        let player = otherPlayers.get(socketId)

        if (player) {
          // If player exists, update position
          player.setPosition(playerData.x, playerData.y, playerData.z)
        } else {
          // If player doesn't exist, create and add to scene
          player = new Player(playerData.x, playerData.y, playerData.z)
          scene.add(player.getMesh())
          otherPlayers.set(socketId, player)
        }
      }
    })
  } else {
    console.warn('Invalid playersData received:', playersData)
  }
})
