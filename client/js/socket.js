import { io } from "socket.io-client";
import { sendError } from "./errorHandler";
// Assuming you've already imported and initialized socket.io on the client:

const socket = io("https://threejs-game.onrender.com");
let countNumber = 0;
socket.on("connect", () => {
  console.log("Connected to the server");
});
// Assuming you've already established a socket connection to the server

socket.on("updateUserCount", (count) => {
  const userCountBox = document.getElementById("userCountBox");
  userCountBox.textContent = "Users connected: " + count;
});

// Listen for the 'hello' event
socket.on("hello", (message) => {
  console.log(message); // Should log "Hello from the server!"
});
