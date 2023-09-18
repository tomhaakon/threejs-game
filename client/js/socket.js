import { io } from "socket.io-client";

// Assuming you've already imported and initialized socket.io on the client:

const socket = io("https://threejs-game.onrender.com");

socket.on("connect", () => {
  console.log("Connected to the server");
});

// Listen for the 'hello' event
socket.on("hello", (message) => {
  console.log(message); // Should log "Hello from the server!"
});
