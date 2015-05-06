var NameForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var name = React.findDOMNode(this.refs.name).value.trim();
    if (!name)
      return;

    // Perform registration actions
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
      <h3>{this.props.name}</h3>
    );
  }
});

var UserSelectForm = React.createClass({
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
        <option value={user}>{user}</option>
      );
    });
    return (
      <form className="userSelectForm" onSubmit={this.handleSubmit}>
        <label htmlFor="user">Start a Conversation</label>
        <select id="user">
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
        {this.props.name ? <NameLabel name="Felipe" /> : <NameForm />}
        <UserSelectForm onNewConversation={this.props.handleNewConversation} />
      </div>
    );
  }
});

var ChatMessages = React.createClass({
  render: function() {
    return (
      <div className="chatMessages">
        //print messages
        Messages be here
      </div>
    );
  }
});

var ChatInputForm = React.createClass({
  render: function() {
    return (
      <form className="chatInputForm">
        <input type="text" placeholder="Enter your message..." ref="message" />
      </form>
    );
  }
});

var ChatBox = React.createClass({
  render: function() {
    return (
      <div className="chatBox">
        <h2>Po-Shen</h2>
        <ChatMessages />
        <ChatInputForm />
      </div>
    );
  }
});

var ChatSystem = React.createClass({
  render: function() {
    return (
      <div className="chatSystem">
        <h1>Miipal</h1>
        <ChatBar />
        <ChatBox />
        <ChatBox />
        <ChatBox />
      </div>
    );
  }
});

React.render(
  <ChatSystem />,
  document.getElementById('content')
);