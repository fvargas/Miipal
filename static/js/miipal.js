var STORAGE_NAME_KEY = '_name';

var NameForm = React.createClass({displayName: "NameForm",
  handleSubmit: function(e) {
    e.preventDefault();

    var name = React.findDOMNode(this.refs.name).value.trim();
    if (!name)
      return;

    this.props.onRegister(name);
  },
  render: function() {
    return (
      React.createElement("form", {className: "nameForm", onSubmit: this.handleSubmit}, 
        React.createElement("label", {htmlFor: "name"}, "Name"), 
        React.createElement("input", {type: "text", id: "name", placeholder: "Po-Shen Loh", ref: "name", autofocus: true})
      )
    );
  }
});

var NameLabel = React.createClass({displayName: "NameLabel",
  render: function() {
    return (
      React.createElement("h3", null, "Hi ", this.props.name, "!")
    );
  }
});

var UserSelectForm = React.createClass({displayName: "UserSelectForm",
  handleSubmit: function(e) {
    e.preventDefault();
    
    var selectedUser = React.findDOMNode(this.refs.user).value;
    // Do nothing if user selected the default option
    if (!selectedUser)
      return;

    this.props.onNewConversation(selectedUser);
  },
  render: function() {
    var users = this.props.users.map(function(user, index) {
      return (
        React.createElement("option", {key: index, value: user}, user)
      );
    });
    return (
      React.createElement("form", {className: "userSelectForm", onChange: this.handleSubmit}, 
        React.createElement("label", {htmlFor: "user"}, "Start a Conversation"), 
        React.createElement("select", {id: "user", ref: "user", defaultValue: ""}, 
          React.createElement("option", {value: ""}, "Select a user..."), 
          users
        )
      )
    );
  }
});

var ChatBar = React.createClass({displayName: "ChatBar",
  render: function() {
    return (
      React.createElement("div", {className: "chatBar"}, 
        this.props.name ? React.createElement(NameLabel, {name: this.props.name}) : React.createElement(NameForm, {onRegister: this.props.onRegister}), 
        React.createElement(UserSelectForm, {users: this.props.users, onNewConversation: this.props.handleNewConversation})
      )
    );
  }
});

var ChatMessages = React.createClass({displayName: "ChatMessages",
  render: function() {
    var messageNodes = this.props.messages.map(function(message, index) {
      return (
        React.createElement("div", {key: index}, 
          message
        )
      );
    });

    return (
      React.createElement("div", {className: "chatMessages"}, 
        messageNodes
      )
    );
  }
});

var ChatInputForm = React.createClass({displayName: "ChatInputForm",
  handleSubmit: function(e) {
    e.preventDefault();

    var message = React.findDOMNode(this.refs.message).value.trim();
    // If empty message do nothing
    if (!message)
      return;

    this.props.onMessageSubmit(message);
    React.findDOMNode(this.refs.message).value = '';
  },
  render: function() {
    return (
      React.createElement("form", {className: "chatInputForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "Enter your message...", ref: "message"})
      )
    );
  }
});

var ChatBox = React.createClass({displayName: "ChatBox",
  getMessages: function() {
    if (isStorageSupported() && (messages = localStorage.getItem(this.props.name)))
      return JSON.parse(messages);
    else
      return [];
  },
  getInitialState: function() {
    return {messages: this.getMessages()};
  },
  handleMessageSubmit: function(message) {
    var newMessageList = this.state.messages.slice();
    newMessageList.push(message);
    this.setState({messages: newMessageList});

    if (isStorageSupported()) {
      localStorage.setItem(this.props.name, JSON.stringify(newMessageList));
    }
  },
  render: function() {
    return (
      React.createElement("div", {className: "chatBox"}, 
        React.createElement("h2", null, this.props.name), 
        React.createElement(ChatMessages, {messages: this.state.messages}), 
        React.createElement(ChatInputForm, {onMessageSubmit: this.handleMessageSubmit})
      )
    );
  }
});

var ChatSystem = React.createClass({displayName: "ChatSystem",
  getName: function() {
    if (isStorageSupported() && (name = localStorage.getItem(STORAGE_NAME_KEY)))
      return name;

    // Local storage not supported or user not registered
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
    var user = data['user'];
    var newUserList = this.state.users.slice();
    var index = newUserList.indexOf(user);

    // If user is found in the user list, remove user
    if (index >= 0) {
      newUserList.splice(index, 1);
      this.setState({users: newUserList});
    }
  },
  updateUsers: function(data) {
    var users = data['user_list'];
    this.setState({users, users});
  },
  getInitialState: function() {
    return {
      name: this.getName(),
      users: [],
      conversations: []
    }
  },
  componentDidMount: function() {
    // Register all the event listeners
    socket.on('add user', this.addUser);
    socket.on('remove user', this.removeUser);
    socket.on('update users', this.updateUsers);

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

    if (isStorageSupported()) {
      localStorage.setItem(STORAGE_NAME_KEY, name);
      this.setState({name: name});
      joinServer(name);
    }
  },
  handleNewConversation: function(user) {
    // User has invalid name
    if (user === STORAGE_NAME_KEY)
      return;

    var newList = this.state.conversations.slice();
    newList.push(user);
    this.setState({conversations: newList});
  },
  render: function() {
    var chatBoxes = this.state.conversations.map(function(person, index) {
      return (
        React.createElement(ChatBox, {key: index, name: person})
      );
    });
    return (
      React.createElement("div", {className: "chatSystem"}, 
        React.createElement("h1", null, "Miipal"), 
        React.createElement(ChatBar, {name: this.state.name, users: this.state.users, 
                 onRegister: this.registerUser, 
                 handleNewConversation: this.handleNewConversation}), 
        chatBoxes
      )
    );
  }
});

React.render(
  React.createElement(ChatSystem, null),
  document.getElementById('content')
);

/**
 * Determine if local storage is supported.
 */
function isStorageSupported() {
  return typeof(Storage) !== 'undefined';
}