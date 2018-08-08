var Client = {};
Client.socket = io.connect();

Client.socket.on('disconnect', function() {
  console.log("Server Disconnected");
});

Client.socket.on('login-complete', function(data) {
  console.log("Login Success");
});

Client.socket.on('agent-enter-room', function(data) {
  console.log("Agent Enter Room");
});

Client.socket.on('agent-exit-room', function(data) {
  console.log("Agent Exit Room");
});

Client.socket.on('room-data', function(data) {
  console.log("Room Data");
});

Client.socket.on('add-items-inventory', function(data) {
  console.log("Add Items Inventory");
});

Client.socket.on('add-items-room', function(data) {
  console.log("Add Items Room");
});

Client.socket.on('remove-items-inventory', function(data) {
  console.log("Remove Items Inventory");
});

Client.socket.on('remove-items-room', function(data) {
  console.log("Remove Items Room");
});

Client.socket.on('event-failed', function(data) {
  console.warning("ERROR: " + data.message);
});
