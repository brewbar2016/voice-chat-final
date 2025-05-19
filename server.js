const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const rooms = {};

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, user }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = user;
    io.to(roomId).emit("user-list", rooms[roomId]);
    socket.to(roomId).emit("user-connected", { id: socket.id, user });

    socket.on("message", (msg) => {
      io.to(roomId).emit("chat-message", { id: socket.id, user, text: msg });
    });

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", socket.id);
      delete rooms[roomId][socket.id];
      io.to(roomId).emit("user-list", rooms[roomId]);
    });
  });
});

server.listen(PORT, () => console.log("✅ Server on port " + PORT));