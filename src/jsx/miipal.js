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
        <option value={user}>{user}</option>
      );
    });
    return (
      <form className="userSelectForm" onSubmit={this.handleSubmit}>
        <label htmlFor="user">Start a Conversation</label>
        <select id="user" ref="user">
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
        {this.props.name ? <NameLabel name={this.props.name} /> : <NameForm />}
        <UserSelectForm users={this.props.users} onNewConversation={this.props.handleNewConversation} />
      </div>
    );
  }
});

var ChatMessages = React.createClass({
  render: function() {
    return (
      <div className="chatMessages">
        {this.props.messages}
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
        <h2>{this.props.name}</h2>
        <ChatMessages messages={this.props.messages} />
        <ChatInputForm />
      </div>
    );
  }
});

var ChatSystem = React.createClass({
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
        <ChatBox name={person.name} messages={person.messages} />
      );
    });
    return (
      <div className="chatSystem">
        <h1>Miipal</h1>
        <ChatBar users={users} handleNewConversation={this.handleNewConversation} />
        {chatBoxes}
      </div>
    );
  }
});

React.render(
  <ChatSystem />,
  document.getElementById('content')
);