const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Enable CORS for all routes
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // this is your client's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  // Send a hello message to the connected client
  socket.emit("hello", "Hello from the server!");

  // your socket.io logic here
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
