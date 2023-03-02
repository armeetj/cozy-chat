const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const { incrementConnectedClients, getConnectedClients, decrementConnectedClients } = require("./funcs");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = 4000;

app.use(helmet());
app.use(cors());

let connectedClients = 0;

io.on("connection", (socket) => {
  socket.on("join", async () => {
    await incrementConnectedClients();
    io.emit("join-broadcast", await getConnectedClients());
  });

  socket.on("message", (data) => {
    io.emit("message-broadcast", data); 
  });

  socket.on("disconnect", async () => {
    await decrementConnectedClients();
    io.emit("join-broadcast", await getConnectedClients());
  });
});

server.listen(port, () => {
  console.log("[SERVER]: online");
});
