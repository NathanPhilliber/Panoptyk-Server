Client.send = {};

Client.send.login = function(username, password) {
  Client.socket.emit('login', {username:username, password:password});
}

Client.send.moveToRoom = function(room_id) {
  Client.socket.emit('move-to-room', {room_id:room_id});
}

Client.send.takeItems = function(items) {

}

Client.send.dropItems = function(items) {

}

