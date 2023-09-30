//server.js
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

app.use(express.static('public'))
app.use(cors())

const players = {} // Data structure to hold all players' positions

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)

  players[socket.id] = { x: 0, y: 0, z: 0 } // Initialize player data

  io.emit('newPlayer', { socketId: socket.id, x: 0, y: 0, z: 0 }) // Broadcast new player with socketId

  socket.on('playerPosition', (position) => {
    console.log(`Received position from ${socket.id}:`, position)
    players[socket.id] = position // Update the position of the player
    io.emit('updatePlayers', players) // Broadcast updated positions to all clients
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
    delete players[socket.id] // Remove disconnected player from the players object
    io.emit('playerDisconnected', socket.id) // Notify all clients about the disconnected player
  })
})

server.listen(3000, () => console.log('listening on *:3000'))
