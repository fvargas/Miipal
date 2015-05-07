var felipe = {
  name: 'Felipe',
  messages: ['Ohaio', 'der', 'p']
}
var poShen = {
  name: 'Po-Shen',
  messages: ['Hello', 'there', '!']
}
var will = {
  name: 'Will',
  messages: [':)', ':D']
}
var people = [felipe, poShen, will];


var NameForm = React.createClass({displayName: "NameForm",
  handleSubmit: function(e) {
    e.preventDefault();

    var name = React.findDOMNode(this.refs.name).value.trim();
    if (!name)
      return;

    // Perform registration actions
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
      React.createElement("h3", null, this.props.name)
    );
  }
});

var UserSelectForm = React.createClass({displayName: "UserSelectForm",
  /*getInitialState: function() {
    return {users: []};
  },
  refreshUsers: function() {
    this.setState({users: ['Felipe', 'Po-Shen', 'Will']});
  },
  componentDidMount: function() {
    this.refreshUsers();
  },*/
  handleSubmit: function(e) {
    e.preventDefault();
    
    var selectedUser = React.findDOMNode(this.refs.user).value;
    this.props.onNewConversation(selectedUser);
  },
  render: function() {
    console.log(this.props.users);
    var users = this.props.users.map(function(user) {
      return (
        React.createElement("option", {value: user}, user)
      );
    });
    return (
      React.createElement("form", {className: "userSelectForm", onSubmit: this.handleSubmit}, 
        React.createElement("label", {htmlFor: "user"}, "Start a Conversation"), 
        React.createElement("select", {id: "user", ref: "user"}, 
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
        this.props.name ? React.createElement(NameLabel, {name: this.props.name}) : React.createElement(NameForm, null), 
        React.createElement(UserSelectForm, {users: this.props.users, onNewConversation: this.props.handleNewConversation})
      )
    );
  }
});

var ChatMessages = React.createClass({displayName: "ChatMessages",
  render: function() {
    return (
      React.createElement("div", {className: "chatMessages"}, 
        this.props.messages
      )
    );
  }
});

var ChatInputForm = React.createClass({displayName: "ChatInputForm",
  render: function() {
    return (
      React.createElement("form", {className: "chatInputForm"}, 
        React.createElement("input", {type: "text", placeholder: "Enter your message...", ref: "message"})
      )
    );
  }
});

var ChatBox = React.createClass({displayName: "ChatBox",
  render: function() {
    return (
      React.createElement("div", {className: "chatBox"}, 
        React.createElement("h2", null, this.props.name), 
        React.createElement(ChatMessages, {messages: this.props.messages}), 
        React.createElement(ChatInputForm, null)
      )
    );
  }
});

var ChatSystem = React.createClass({displayName: "ChatSystem",
  handleNewConversation: function(user) {
    // handle new convo with user
  },
  render: function() {
    var users = people.map(function(person) {
      return (
        person.name
      );
    });
    var chatBoxes = people.map(function(person) {
      return (
        React.createElement(ChatBox, {name: person.name, messages: person.messages})
      );
    });
    return (
      React.createElement("div", {className: "chatSystem"}, 
        React.createElement("h1", null, "Miipal"), 
        React.createElement(ChatBar, {users: users, handleNewConversation: this.handleNewConversation}), 
        chatBoxes
      )
    );
  }
});

React.render(
  React.createElement(ChatSystem, null),
  document.getElementById('content')
);