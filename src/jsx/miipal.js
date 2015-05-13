// Key for storing the user's name in the browser
var STORAGE_NAME_KEY = '_name';

var NameForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var name = React.findDOMNode(this.refs.name).value.trim();
    if (!name)
      return;

    this.props.onRegister(name);
  },
  render: function() {
    return (
      <form className="nameForm" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" className="form-control" placeholder="Po-Shen Loh" ref="name" autoFocus="autoFocus" />
        </div>
      </form>
    );
  }
});

var NameLabel = React.createClass({
  render: function() {
    return (
      <h3>Hi {this.props.name}!</h3>
    );
  }
});

var UserSelectForm = React.createClass({
  handleChange: function(e) {
    e.preventDefault();

    var select = React.findDOMNode(this.refs.user);
    var selectedUser = select.value;
    // Reset select element
    select.selectedIndex = 0;

    // Do nothing if user selected default option or user has not registered
    if (!selectedUser || !this.props.userHasRegistered)
      return;

    // Create new chat box with selected user
    this.props.onNewConversation(selectedUser);
  },
  render: function() {
    var users = this.props.users.map(function(user, index) {
      return (
        <option key={index} value={user}>{user}</option>
      );
    });
    return (
      <form className="userSelectForm" onChange={this.handleChange}>
        <div className="form-group">
          <label htmlFor="user">Start a Conversation</label>
          <select id="user" className="form-control" ref="user" defaultValue="">
            <option value="">Select a user...</option>
            {users}
          </select>
        </div>
      </form>
    );
  }
});

var ChatBar = React.createClass({
  render: function() {
    return (
      <div className="chatBar panel panel-default row">
        <div className="panel-body">
          <div className="col-sm-4">
            {this.props.name ? <NameLabel name={this.props.name} /> : <NameForm onRegister={this.props.onRegister} />}
          </div>
          <div className="col-sm-8">
            <UserSelectForm users={this.props.users}
                            userHasRegistered={this.props.name ? true : false}
                            onNewConversation={this.props.handleNewConversation} />
          </div>
        </div>
      </div>
    );
  }
});

var ChatMessages = React.createClass({
  render: function() {
    var messageNodes = this.props.messages.map(function(message, index) {
      return (
        <div key={index}>
          {message}
        </div>
      );
    });

    return (
      <div className="chatMessages">
        {messageNodes}
      </div>
    );
  }
});

var ChatInputForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var message = React.findDOMNode(this.refs.message).value.trim();
    // If empty message do nothing
    if (!message)
      return;

    if (this.props.onMessageSubmit(message))
      React.findDOMNode(this.refs.message).value = '';
  },
  render: function() {
    return (
      <form className="chatInputForm" onSubmit={this.handleSubmit}>
        <input type="text" className="form-control" placeholder="Enter your message..." ref="message" autoFocus="autoFocus" />
      </form>
    );
  }
});

var ChatBox = React.createClass({
  getMessages: function() {
    if (isStorageSupported() &&
        (messages = localStorage.getItem(this.props.friendName))) {
      return JSON.parse(messages);
  } else {
      return [];
    }
  },
  getInitialState: function() {
    return {
      messages: this.getMessages()
    };
  },
  addAndStoreNewMessage: function(message) {
    // Update messages state
    var newMessageList = this.state.messages.slice();
    newMessageList.push(message);
    this.setState({messages: newMessageList});

    // Store the new message
    if (isStorageSupported()) {
      localStorage.setItem(this.props.friendName,
                           JSON.stringify(newMessageList));
    }
  },
  handleMessageSubmit: function(message) {
    if (this.props.friendIsConnected) {
      // Prepend user's name to message
      message = this.props.myName + ': ' + message;

      this.addAndStoreNewMessage(message);
      // Send the message to the server
      sendMessage(this.props.myName, this.props.friendName, message);

      return true;
    } else {
      return false;
    }
  },
  scrollToBottom: function() {
    var chatBody = React.findDOMNode(this.refs.body);
    chatBody.scrollTop = chatBody.scrollHeight;
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.latestMessage !== '')
      this.addAndStoreNewMessage(nextProps.latestMessage);
  },
  handleCloseBox: function() {
    this.props.onCloseBox(this.props.friendName);
  },
  componentDidMount: function() {
    this.scrollToBottom();
  },
  componentDidUpdate: function() {
    this.scrollToBottom();
  },
  render: function() {
    var friendDisconnectedAlert;
    if (!this.props.friendIsConnected) {
      friendDisconnectedAlert = <div className="alert alert-danger"
                                     role="alert">
                                     {this.props.friendName} is currently offline</div>;
    } else {
      friendDisconnectedAlert = '';
    }

    return (
      <div className="chatBox panel panel-primary">
        <div className="panel-heading">
          <span className="panel-title">{this.props.friendName}</span>
          <button type="button" className="close"
                  onClick={this.handleCloseBox}>&times;</button>
        </div>
        <div className="panel-body" ref="body">
          <ChatMessages messages={this.state.messages} />
          {friendDisconnectedAlert}
        </div>
        <div className="panel-footer">
          <ChatInputForm onMessageSubmit={this.handleMessageSubmit} />
        </div>
      </div>
    );
  }
});

var ChatSystem = React.createClass({
  getName: function() {
    if (isStorageSupported() && (name = localStorage.getItem(STORAGE_NAME_KEY)))
      return name;

    // Local storage not supported or user has not registered
    return '';
  },
  addUser: function(data) {
    var newUser = data.user;

    // If new user is not the same as the current user
    if (newUser !== this.state.name) {
      // Add the new user to the user list
      var newUserList = this.state.users.slice();
      newUserList.push(newUser);
      this.setState({users: newUserList});
    }
  },
  removeUser: function(data) {
    var user = data.user;
    var newUserList = this.state.users.slice();
    var index = newUserList.indexOf(user);

    // If user is found in the user list
    if (index >= 0) {
      // Remove user
      newUserList.splice(index, 1);
      this.setState({users: newUserList});
    }
  },
  updateUsers: function(data) {
    var users = data.user_list;
    this.setState({users: users});
  },
  newMessageReceived: function(data) {
    var sender = data.sender;
    var message = data.message;

    // If a conversation with this user is not already open
    if (this.state.conversations.indexOf(sender) < 0) {
      var newConversations = this.state.conversations.slice();
      newConversations.push(sender);
      /**
       * It is important that a new conversation be given its own setState()
       * call because componentWillReceiveProps() will not be called for the
       * initial render of a component.
       */
      this.setState({conversations: newConversations});
    }

    var latestMessage = {
      friendName: sender,
      message: message
    };
    this.setState({latestMessage: latestMessage}, function() {
      var defaultMessage =  {
        friendName: '',
        message: ''
      };
      this.setState({latestMessage: defaultMessage});
    });
  },
  getInitialState: function() {
    return {
      name: this.getName(),
      users: [],
      conversations: [],
      latestMessage: {
        friendName: '',
        message: ''
      }
    }
  },
  componentDidMount: function() {
    // Register all the event listeners
    socket.on('add user', this.addUser);
    socket.on('remove user', this.removeUser);
    socket.on('update users', this.updateUsers);
    socket.on('new message', this.newMessageReceived);

    // If client is already registered, join the chat network
    if (this.state.name)
      joinServer(this.state.name);
    
    // Get the list of currently connected users
    getUsers();
  },
  registerUser: function(name) {
    // Client tried to register with invalid name
    if (name === STORAGE_NAME_KEY)
      return;

    if (isStorageSupported())
      localStorage.setItem(STORAGE_NAME_KEY, name);

    this.setState({name: name});
    joinServer(name);
  },
  handleNewConversation: function(user) {
    // User has invalid name
    if (user === STORAGE_NAME_KEY)
      return;

    // If a conversation with this user is not already open
    if (this.state.conversations.indexOf(user) < 0) {
      var newList = this.state.conversations.slice();
      newList.push(user);
      this.setState({conversations: newList});
    }
  },
  handleCloseBox: function(user) {
    var conversations = this.state.conversations.slice();
    var index = conversations.indexOf(user);
    
    if (index >= 0) {
      conversations.splice(index, 1);
      this.setState({conversations: conversations});
    }
  },
  isUserConnected: function(user) {
    if (this.state.users.indexOf(user) >= 0)
      return true;
    else
      return false;
  },
  render: function() {
    /**
     * These assignments are necessary because of scoping witin the callback
     * below.
     */
    var myName = this.state.name;
    var latestMessage = this.state.latestMessage;
    var handleCloseBox = this.handleCloseBox;
    var isUserConnected = this.isUserConnected;

    var chatBoxes = this.state.conversations.map(function(friendName, index) {
      var message = latestMessage.friendName === friendName ?
                      latestMessage.message : '';
      var friendIsConnected = isUserConnected(friendName);

      return (
        <div key={index} className="col-sm-3">
          <ChatBox myName={myName} friendName={friendName}
                   friendIsConnected={friendIsConnected}
                   onCloseBox={handleCloseBox} latestMessage={message} />
        </div>
      );
    });

    return (
      <div className="chatSystem">
        <h1>Miipal</h1>
        <ChatBar name={this.state.name} users={this.state.users}
                 onRegister={this.registerUser}
                 handleNewConversation={this.handleNewConversation} />
        <div className="row">
          {chatBoxes}
        </div>
      </div>
    );
  }
});

React.render(
  <ChatSystem />,
  document.getElementById('content')
);

/**
 * Determine if local storage is supported.
 */
function isStorageSupported() {
  return typeof(Storage) !== 'undefined';
}