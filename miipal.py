'''
User refers to the person affiliated with a particular name in the network.
Client refers to the client-end of a connection.
'''

from flask import Flask, render_template, request, session
from flask.ext.socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.debug = True
socketio = SocketIO(app)

# Maps client session ids to names
clients = {}
# Maps names to number of clients using that name
# e.g. if user is connecting from multiple tabs
users = {}

@app.route('/')
def home():
    return render_template('home.html')

@socketio.on('join')
def on_join(data):
    name = data['name']

    clients[request.namespace.socket.sessid] = name
    users[name] = users.get(name, 0) + 1
    
    # Add client to the room representing the user
    join_room(name)

    # If user was not already connected
    if users[name] == 1:
        # Broadcast the user that just joined
        emit('add user', {'user': name}, broadcast=True)

@socketio.on('get users')
def on_get_users():
    user_names = users.keys()
    # If client has already joined the server
    if clients.has_key(request.namespace.socket.sessid):
        # Remove the client's name from the list of users
        user_names.remove(clients[request.namespace.socket.sessid])

    emit('update users', {'user_list': user_names})

@socketio.on('disconnect')
def on_disconnect():
    # If client did not join server prior to disconnecting
    if not clients.get(request.namespace.socket.sessid):
        return

    # Get the user associated with this client connection
    user = clients[request.namespace.socket.sessid]
    # Remove client from list of client connections
    del clients[request.namespace.socket.sessid]

    # If this is the last connection for this user
    if users.get(user, 1) <= 1:
        # Delete from list of users
        del users[user]
        # Broadcast departure of this user
        emit('remove user', {'user': user}, broadcast=True)
    # Otherwise decrease count by one
    else:
        users[user] = users[user] - 1

if __name__ == '__main__':
    socketio.run(app)