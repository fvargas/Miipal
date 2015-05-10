var socket = io.connect();

function joinServer(name) {
  socket.emit('join', {name: name});
}

function getUsers() {
  socket.emit('get users');
}

function sendMessage(myName, friendName, message) {
  var data = {
    sender: myName,
    recipient: friendName,
    message: message
  };
  socket.emit('send message', data);
}