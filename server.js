const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('🔌 Новое подключение');

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });

  socket.on('chat-message', (data) => {
    io.to(data.room).emit('chat-message', data);
  });

  socket.on('toggle-mic', (data) => {
    socket.to(data.room).emit('toggle-mic', data);
  });

  socket.on('screen-share', (data) => {
    socket.to(data.room).emit('screen-share', data);
  });
});

http.listen(PORT, () => {
  console.log('✅ Сервер запущен на порту ' + PORT);
});