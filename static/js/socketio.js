var socket = io.connect();

function joinServer(name) {
  socket.emit('join', {name: name});
}

function getUsers() {
  socket.emit('get users');
}