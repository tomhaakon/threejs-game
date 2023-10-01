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
let numberOfUsers = 0
const players = {} // Data structure to hold all players' positions

io.on('connection', (socket) => {
  console.log('A user connected', socket.id)
  console.log('Connected clients:', Object.keys(io.sockets.sockets).length) // Log total connected sockets
  numberOfUsers++
  io.emit('userCountUpdate', numberOfUsers)
  players[socket.id] = { x: 0, y: 0, z: 0 } // Initialize player data

  io.emit('newPlayer', { socketId: socket.id, x: 0, y: 0, z: 0 }) // Broadcast new player with socketId

  socket.on('playerPosition', (position) => {
    console.log(`Received position from ${socket.id}:`, position)
    players[socket.id] = position // Update the position of the player
    io.emit('updatePlayers', players) // Broadcast updated positions to all clients
  })

  socket.on('disconnect', () => {
    numberOfUsers--
    io.emit('userCountUpdate', numberOfUsers)
    console.log('A user disconnected', socket.id)
    console.log('Remaining clients:', Object.keys(io.sockets.sockets).length) // Log total remaining sockets
    delete players[socket.id] // Remove disconnected player from the players object
    io.emit('playerDisconnected', socket.id) // Notify all clients about the disconnected player
  })
})

server.listen(3000, () => console.log('listening on *:3000'))
