// socket.io
import { io } from 'socket.io-client'
const serverURL =
  process.env.NODE_ENV === 'production'
    ? 'https://threejs-game.onrender.com'
    : 'http://localhost:3000'

const socket = io('http://localhost:3000')
//const socket = io('https://threejs-game.onrender.com')

socket.on('connect', () => {
  console.log('Connected to the server')
})

socket.on('hello', (message) => {
  console.log(message)
})

export default socket
