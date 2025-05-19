const socket = io();

const roomId = "main"; // может быть получено из URL или формы
const userId = Math.floor(Math.random() * 100000);

socket.emit('join-room', roomId, userId);

const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');

sendBtn.onclick = () => {
  const msg = chatInput.value;
  if (msg.trim()) {
    socket.emit('chat-message', { room: roomId, user: userId, message: msg });
    chatBox.value += "Вы: " + msg + "\n";
    chatInput.value = '';
  }
};

socket.on('chat-message', (data) => {
  chatBox.value += "Другой: " + data.message + "\n";
});