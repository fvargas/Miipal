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
        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder="Po-Shen Loh" ref="name" autofocus />
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
        <option key={index} value={user}>{user}</option>
      );
    });
    return (
      <form className="userSelectForm" onChange={this.handleSubmit}>
        <label htmlFor="user">Start a Conversation</label>
        <select id="user" ref="user" defaultValue="">
          <option value="">Select a user...</option>
          {users}
        </select>
      </form>
    );
  }
});

var ChatBar = React.createClass({
  render: function() {
    return (
      <div className="chatBar">
        {this.props.name ? <NameLabel name={this.props.name} /> : <NameForm onRegister={this.props.onRegister} />}
        <UserSelectForm users={this.props.users} onNewConversation={this.props.handleNewConversation} />
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

    this.props.onMessageSubmit(message);
    React.findDOMNode(this.refs.message).value = '';
  },
  render: function() {
    return (
      <form className="chatInputForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Enter your message..." ref="message" />
      </form>
    );
  }
});

var ChatBox = React.createClass({
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
      <div className="chatBox">
        <h2>{this.props.name}</h2>
        <ChatMessages messages={this.state.messages} />
        <ChatInputForm onMessageSubmit={this.handleMessageSubmit} />
      </div>
    );
  }
});

var ChatSystem = React.createClass({
  getName: function() {
    if (isStorageSupported() && (name = localStorage.getItem(STORAGE_NAME_KEY)))
      return name;

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
    // Invalid name matches 
    if (name === STORAGE_NAME_KEY)
      return;
    if (isStorageSupported()) {
      localStorage.setItem(STORAGE_NAME_KEY, name);
      this.setState({name: name});
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
        <ChatBox key={index} name={person} />
      );
    });
    return (
      <div className="chatSystem">
        <h1>Miipal</h1>
        <ChatBar name={this.state.name} users={this.state.users}
                 onRegister={this.registerUser}
                 handleNewConversation={this.handleNewConversation} />
        {chatBoxes}
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