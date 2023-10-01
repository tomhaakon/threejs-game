//socket.js
import { io } from 'socket.io-client'
import { PlayerManager } from './modules/playerManager.js'
import { Player } from './modules/player.js'
import SceneManager from './enviroment/sceneManager.js'
import { modelManager } from './model/modelManager.js'
import { ModelPlayer } from './modules/modelPlayer.js'
import { miniConsole } from './miniConsole.js'

const scene = SceneManager.getScene()
const miniConsoleInstance = new miniConsole()
//import { scene } from '../main.js'
const playerManager = new PlayerManager()
const otherPlayers = new Map()
export const socket = io.connect('http://localhost:3000')

const modelMng = new modelManager()

socket.on('connect', async () => {
  console.warn('Connected to the server')
  try {
    await modelMng.modelsLoadedPromise // Waits for models to load
    // Proceed with player creation and other operations here
  } catch (error) {
    console.error('Failed to load models:', error)
    // Handle model loading failure here
  }
})
socket.on('userCountUpdate', (userCount) => {
  // Update the mini console with the number of connected users
  miniConsoleInstance.update(
    `Connected Users: ${userCount}`,
    'Left',
    'userCount'
  )
})
// Handling new player connection
socket.on('newPlayer', (playerData) => {
  //console.log('New player data received:', playerData)
  if (
    playerData.socketId !== socket.id &&
    !otherPlayers.has(playerData.socketId)
  ) {
    const newPlayer = new Player(playerData.x, playerData.y, playerData.z)
    scene.add(newPlayer.getMesh())
    otherPlayers.set(playerData.socketId, newPlayer)
    //   console.log('Player added:', newPlayer)
  }
})
// Handling player disconnection
socket.on('playerDisconnected', (disconnectedSocketId) => {
  const disconnectedPlayer = otherPlayers.get(disconnectedSocketId)
  if (disconnectedPlayer) {
    scene.remove(disconnectedPlayer.getMesh()) // Remove player's mesh from scene
    otherPlayers.delete(disconnectedSocketId) // Remove player from the Map
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
  //console.log('Raw players data received:', playersData)

  // Check if playersData is a non-null object before proceeding
  if (playersData && typeof playersData === 'object') {
    Object.entries(playersData).forEach(([socketId, playerData]) => {
      if (socketId !== socket.id) {
        let player = otherPlayers.get(socketId)

        // console.log(`Player data for socket ${socketId}:`, playerData)

        if (player) {
          // If player exists, update position
          player.setPosition(playerData.x, playerData.y, playerData.z)
        } else {
          // If player doesn't exist, create and add to scene
          player = new Player(playerData.x, playerData.y, playerData.z)
          scene.add(player.getMesh())
          otherPlayers.set(socketId, player)
          //  console.log('New player added:', player)
        }
      }
    })
  } else {
    console.warn('Invalid playersData received:', playersData)
  }
})
