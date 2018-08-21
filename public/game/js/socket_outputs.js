Client.send = {};

Client.send.login = function(username, password) {
  Client.socket.emit('login', {username:username, password:password});
}

Client.send.moveToRoom = function(room_id) {
  Client.socket.emit('move-to-room', {room_id:room_id});
}

Client.send.takeItems = function(items) {
  var id_list = [];
  for (let item of items) {
    id_list.push(item.item_id);
  }

  Client.socket.emit('take-items', {item_ids:id_list});
}

Client.send.dropItems = function(items) {
  var id_list = [];
  for (let item of items) {
    id_list.push(item.item_id);
  }

  Client.socket.emit('drop-items', {item_ids:id_list});
}

