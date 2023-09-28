// server.js
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { time } = require('console')

const app = express()
const server = http.createServer(app)

// const corsOrigins =
//   process.env.NODE_ENV === 'production'
//     ? ['https://threejs-game.onrender.com', 'https://game.tomhaakon.com']
//     : ['http://localhost:3000', 'http://localhost:5173']
const corsOrigins =
  process.env.NODE_ENV === 'production'['http://localhost:5173']
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['my-custom-header'],
//     credentials: true,
//   })
// )

const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})

let players = {}
const timestampSent = Date.now()
io.on('connection', (socket) => {
  console.log('User connected', timestampSent)

  // socket.on('playerMovement', (playerData) => {
  //   // console.log('Player Moved: ', playerData)
  //   players[socket.id] = playerData
  //   socket.broadcast.emit('otherPlayerMovement', players)
  // })

  socket.on('playerMovement', (playerData, callback) => {
    console.log(`Player ${socket.id} Moved: `, playerData)
    players[socket.id] = playerData // Update the server's player data
    io.emit('otherPlayerMovement', players) // Broadcast updated player list to all clients
    callback && callback('Received playerMovement event')
  })

  socket.on('otherPlayerMovement', (data, callback) => {
    console.log('Received otherPlayerMovement:', data)
    callback && callback('Received otherPlayerMovement event')
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
    delete players[socket.id]
    io.emit('playerDisconnected', socket.id)
  })
})

server.listen(3000, () => {
  console.log('Server is running on port 3000')
})
