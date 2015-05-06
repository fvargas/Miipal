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
  getInitialState: function() {
    return {users: []};
  },
  refreshUsers: function() {
    this.setState({users: ['Felipe', 'Po-Shen', 'Will']});
  },
  componentDidMount: function() {
    this.refreshUsers();
  },
  handleSubmit: function(e) {
    e.preventDefault();
    
    var selectedUser = document.getElementById('user').value;
    this.props.onNewConversation(selectedUser);
  },
  render: function() {
    var users = this.state.users.map(function(user) {
      return (
        React.createElement("option", {value: user}, user)
      );
    });
    return (
      React.createElement("form", {className: "userSelectForm", onSubmit: this.handleSubmit}, 
        React.createElement("label", {htmlFor: "user"}, "Start a Conversation"), 
        React.createElement("select", {id: "user"}, 
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
        this.props.name ? React.createElement(NameLabel, {name: "Felipe"}) : React.createElement(NameForm, null), 
        React.createElement(UserSelectForm, {onNewConversation: this.props.handleNewConversation})
      )
    );
  }
});

var ChatMessages = React.createClass({displayName: "ChatMessages",
  render: function() {
    return (
      React.createElement("div", {className: "chatMessages"}, 
        "//print messages" + ' ' +
        "Messages be here"
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
        React.createElement("h2", null, "Po-Shen"), 
        React.createElement(ChatMessages, null), 
        React.createElement(ChatInputForm, null)
      )
    );
  }
});

var ChatSystem = React.createClass({displayName: "ChatSystem",
  render: function() {
    return (
      React.createElement("div", {className: "chatSystem"}, 
        React.createElement("h1", null, "Miipal"), 
        React.createElement(ChatBar, null), 
        React.createElement(ChatBox, null), 
        React.createElement(ChatBox, null), 
        React.createElement(ChatBox, null)
      )
    );
  }
});

React.render(
  React.createElement(ChatSystem, null),
  document.getElementById('content')
);