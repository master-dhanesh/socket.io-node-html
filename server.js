const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let users = [],
  connections = [];

server.listen(3000, console.log("Chat server running on port 3000"));

// GET home page
app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected.`);

  // New User
  socket.on("new user", (data, cb) => {
    cb(true);
    socket.username = data;
    users.push(socket.username);
    io.emit("get users", users);
  });

  //   Send Message
  socket.on("send message", (data) => {
    io.emit("new message", { msg: data, user: socket.username });
  });

  //   Disconnected
  socket.on("disconnect", (data) => {
    users.splice(connections.indexOf(socket), 1);
    io.emit("get users", users);
    connections.splice(connections.indexOf(socket.username), 1);
    console.log(`Disconnected: ${connections.length} sockets connected.`);
  });
});
