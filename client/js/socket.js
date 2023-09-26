// Socket.io
import { io } from 'socket.io-client'
import { notifyScreen } from './notifyScreen'

const socket = io('https://threejs-game.onrender.com')
let counter = 0

notifyScreen('Users connected', counter)

socket.on('connect', () => {
  console.log('Connected to the server')
})

socket.on('updateUserCount', (count) => {
  counter = count
  notifyScreen('Users connected', counter)
})

socket.on('hello', (message) => {
  console.log(message)
})
