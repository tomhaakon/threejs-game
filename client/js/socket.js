// Socket.io
import { io } from 'socket.io-client'
import { NotifyScreen } from './NotifyScreen'

const socket = io('https://threejs-game.onrender.com')
let counter = 0

NotifyScreen('Users connected', counter)

socket.on('connect', () => {
  console.log('Connected to the server')
})

socket.on('updateUserCount', (count) => {
  counter = count
  NotifyScreen('Users connected', counter)
})

socket.on('hello', (message) => {
  console.log(message)
})
