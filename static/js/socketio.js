var socket = io.connect();

/**
 * Emit an event to join the server.
 *
 * @param {string} name
 */
function joinServer(name) {
  socket.emit('join', {name: name});
}

/**
 * Issue a request for the list of connected users.
 */
function getUsers() {
  socket.emit('get users');
}

/**
 * Send a message to a particular user.
 *
 * @param {string} myName
 * @param {string} friendName
 * @param {string} message
 */
function sendMessage(myName, friendName, message) {
  var data = {
    sender: myName,
    recipient: friendName,
    message: message
  };
  socket.emit('send message', data);
}