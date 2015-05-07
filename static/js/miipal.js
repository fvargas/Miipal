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
    var messageList = this.state.messages.slice();
    messageList.push(message);
    this.setState({messages: messageList});

    if (isStorageSupported()) {
      localStorage.setItem(this.props.name, JSON.stringify(messageList));
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
    if (isStorageSupported() && localStorage.name)
      return localStorage.name;

    // Local storage not supported or user not registered
    return '';
  },
  fetchUserList: function() {
    return ['Elon', 'Steve', 'Tesla'];
  },
  getInitialState: function() {
    return {
      name: this.getName(),
      users: this.fetchUserList(),
      conversations: []
    }
  },
  registerUser: function(name) {
    if (isStorageSupported()) {
      localStorage.name = name;
      this.setState({name: name});
    }
  },
  handleNewConversation: function(user) {
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