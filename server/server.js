// const express = require("express");

// const app = express();
// app.use(express.json());

// const API_URL = process.env.API_URL;
// const API_KEY = process.env.API_KEY;

// const port = 3000;

// app.post("/api/add-text", (req, res) => {
//   const { text } = req.body;
//   // Insert the text into the database
//   // Send a response
//   res.json({ success: true, message: "Text added successfully" });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  // Example: Listen for a 'message' event from the client
  socket.on("message", (data) => {
    console.log(data);

    // Broadcast the message to all connected clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
