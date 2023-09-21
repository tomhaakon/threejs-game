const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const app = express()

// Enable CORS for all routes
app.use(
  cors({
    origin: [
      'https://threejs-game.onrender.com',
      'https://game.tomhaakon.com',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  })
)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      'https://threejs-game.onrender.com',
      'http://localhost:5173',
      'https://game.tomhaakon.com',
    ], // Allow both the deployed client's URL and the local development URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})

let userCount = 0

io.on('connection', (socket) => {
  console.log('User connected')
  userCount++
  io.emit('updateUserCount', userCount) // Broadcast to all clients

  socket.on('disconnect', () => {
    console.log('User disconnected')
    userCount--
    io.emit('updateUserCount', userCount) // Broadcast to all clients
  })

  // ... other socket.io logic
})

server.listen(3000, () => {
  console.log('Server is running on port 3000')
})
