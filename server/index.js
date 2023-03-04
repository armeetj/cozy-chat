const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const {
  getConnectedCount,
  createUser,
  getUsers,
  removeUser,
} = require("./funcs");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = 4000;

app.use(helmet());
app.use(cors());

io.on("connection", (socket) => {
  socket.on("c-user-join", async () => {
    const user = await createUser(socket.id);
    socket.emit("s-user-join", user.id);
    io.emit("s-users-update", await getUsers());
  });

  socket.on("c-user-leave", async () => {
    const user = await removeUser(socket.id);
    io.emit("s-users-update", await getUsers());
  });

  socket.on("c-message", (message) => {
    io.emit("s-message-broadcast", {
      id: socket.id,
      message: message,
    });
  });
});

server.listen(port, () => {
  console.log("[SERVER]: online");
});
