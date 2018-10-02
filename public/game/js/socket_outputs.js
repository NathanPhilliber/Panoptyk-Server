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

Client.send.joinCnode = function(cnode) {
  Client.socket.emit('join-cnode', {cnode_id: cnode.cnode_id});
}

Client.send.leaveCnode = function(cnode) {
  Client.socket.emit('leave-cnode', {cnode_id: cnode.cnode_id});
}

Client.send.requestTrade = function(agent_id) {
  console.log("Requesting trade with agent " + agent_id);
  Client.socket.emit('request-trade', {agent_id: agent_id});
}

Client.send.acceptTrade = function(trade_id) {
  Client.socket.emit('accept-trade', {trade_id:trade_id});
}

Client.send.cancelTrade = function(trade_id) {
  Client.socket.emit('cancel-trade', {trade_id:trade_id});
}

Client.send.offerItemsTrade = function(trade_id, items) {

}

Client.send.withdrawItemsTrade = function(trade_id, items) {

}

Client.send.readyTrade = function(trade_id, status) {

}



