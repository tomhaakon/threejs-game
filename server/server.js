const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://threejs-game.onrender.com",
    "http://localhost:5173",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use((req, res, next) => {
  console.log("Origin Header:", req.headers.origin);
  next();
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://threejs-game.onrender.com", "http://localhost:5173"], // Allow both the deployed client's URL and the local development URL
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
