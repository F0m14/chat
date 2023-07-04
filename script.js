// Get elements from the DOM
const loginContainer = document.querySelector('.login-container');
const chatAppContainer = document.querySelector('.chat-app-container');
const logoutBtn = document.querySelector('#logout-btn');
const addFriendBtn = document.querySelector('#add-friend-btn');
const friendList = document.querySelector('#friend-list');
const messageList = document.querySelector('#message-list');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');

const Uusername = document.querySelector("#username");

// Check if user is already logged in
const isLoggedIn = () => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  return username && password;
}

// Handle login form submission
const handleLoginSubmit = (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  localStorage.setItem('username', username);
  localStorage.setItem('password', password);
  loginContainer.style.display = 'none';
  chatAppContainer.style.display = 'flex';
  renderFriendList();
  renderMessageList();
}

// Handle logout button click
const handleLogoutClick = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('password');
  loginContainer.style.display = 'flex';
  chatAppContainer.style.display = 'none';
}

// Render friend list
const renderFriendList = () => {
  friendList.innerHTML = ''; // Clear the list first
  Uusername.innerHTML = localStorage.getItem('username');
  const friends = JSON.parse(localStorage.getItem('friends')) || [];
  friends.forEach((friend) => {
    const li = document.createElement('li');
    li.textContent = friend;
    li.addEventListener('click', () => {
      renderMessageList(friend);
    });
    friendList.appendChild(li);
  });
}

// Handle add friend button click
const handleAddFriendClick = () => {
  const friendName = prompt('Enter your friend\'s name:');
  if (friendName) {
    const friends = JSON.parse(localStorage.getItem('friends')) || [];
    friends.push(friendName);
    localStorage.setItem('friends', JSON.stringify(friends));
    renderFriendList();
  }
}

// Render message list for a specific friend (or all friends)
const renderMessageList = (friend) => {
  messageList.innerHTML = ''; // Clear the list first
  const username = localStorage.getItem('username');
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.filter((message) => {
    if (friend) {
      return (message.from === username && message.to === friend) ||
             (message.from === friend && message.to === username);
    } else {
      return message.to === username || message.from === username;
    }
  }).forEach((message) => {
    const div = document.createElement('div');
    div.textContent = `${message.from}: ${message.content}`;
    div.classList.add(message.from === username ? 'message-sent' : 'message-received');
    messageList.appendChild(div);
  });
}

// Handle message form submission
const handleMessageSubmit = (e) => {
  e.preventDefault();
  const username = localStorage.getItem('username');
  const content = messageInput.value;
  const friend = friendList.querySelector('.active')?.textContent;
  if (friend && content) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push({ from: username, to: friend, content: content });
    localStorage.setItem('messages', JSON.stringify(messages));
    messageInput.value = '';
    renderMessageList(friend);
  }
}

// Add event listeners
if (isLoggedIn()) {
  loginContainer.style.display = 'none';
  chatAppContainer.style.display = 'flex';
  renderFriendList();
  renderMessageList();
}
document.querySelector('#login-form').addEventListener('submit', handleLoginSubmit);
logoutBtn.addEventListener('click', handleLogoutClick);
addFriendBtn.addEventListener('click', handleAddFriendClick);
messageForm.addEventListener('submit', handleMessageSubmit);
friendList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (li) {
    friendList.querySelectorAll('li').forEach((li) => li.classList.remove('active'));
    li.classList.add('active');
    renderMessageList(li.textContent);
  }
});