var Client = {};
Client.socket = io.connect();

Client.socket.on('disconnect', function() {
  console.log("Server Disconnected");
  Client.socket.disconnect();
});

Client.socket.on('login-complete', function(data) {
  console.log("Login Success");
  console.log(data);
  new Agent(data.agent_data.agent_id, data.agent_data.agent_name, true);
  updateAgentInfo(data.agent_data.agent_name, data.agent_data.agent_id);
  updateInventoryAdd(data.agent_data.inventory);
  showGameArea();
});

Client.socket.on('agent-enter-room', function(data) {
  console.log("Agent Enter Room");
  var agent = new Agent(data.agent_data.agent_id, data.agent_data.agent_name, false);
  current_room.place_agent(data.room_id, agent);
  agent.move(Math.random() * (game.canvas.width-150) + 75, Math.random() * (game.canvas.height-150) + 75);
});

Client.socket.on('agent-exit-room', function(data) {
  console.log("Agent Exit Room");
  current_room.remove_agent(data.agent_id, data.room_id);
});

Client.socket.on('room-data', function(data) {
  console.log("Room Data");
  console.log(data);
  new Room(data.room_data.room_id, data.room_data.room_name, data.room_data.adjacent_rooms, data.room_data.layout, data.agents, data.items, data.old_room_id);

  for (let cnode_data of data.room_data.layout.cnodes) {
    var cnode = new Cnode(cnode_data.cnode_id, cnode_data.max_agents, cnode_data.agent_ids);
    current_room.cnodes.push(cnode);
  }

});

Client.socket.on('add-items-inventory', function(data) {
  console.log("Add Items Inventory");
  updateInventoryAdd(data.items_data);
});

Client.socket.on('add-items-room', function(data) {
  console.log("Add Items Room");

  for (let item of data.items_data) {
    current_room.place_item(item, data.agent_id);
  }
});

Client.socket.on('remove-items-inventory', function(data) {
  console.log("Remove Items Inventory");

  updateInventoryRemove(data.item_ids);
});

Client.socket.on('remove-items-room', function(data) {
  console.log("Remove Items Room");
  console.log(data);
  for (let item_id of data.item_ids) {
    current_room.remove_item(item_id, data.agent_id);
  }
});

Client.socket.on('cnode-data', function(data) {
  console.log("cnode-data event: " + data);
});

Client.socket.on('agent-join-cnode', function(data) {
  console.log("agent-join-cnode event: " + data);
  console.log(data);
  current_room.get_cnode(data.cnode_id).add_agent(current_room.get_agent(data.agent_id));
});

Client.socket.on('agent-leave-cnode', function(data) {
  console.log("agent-leave-cnode event: " + JSON.stringify(data));

  current_room.get_cnode(data.cnode_id).remove_agent(current_room.get_agent(data.agent_id));
});

Client.socket.on('trade-requested', function(data) {
  console.log("trade-requested event: " + JSON.stringify(data));

  updateTradeRequest(data.trade_id, data.agent_id);
  current_room.get_agent(data.agent_id).last_trade_id = data.trade_id;
});

Client.socket.on('trade-accepted', function(data) {
  console.log('trade-accepted event: ' + JSON.stringify(data));

  // create trade object
  Agent.my_agent.add_trade(new Trade(current_room.get_agent(data.agent_id), data.trade_id));
});

Client.socket.on('trade-declined', function(data) {
  console.log('trade-declined event');

  Agent.my_agent.remove_trade(data.trade_id);
});

Client.socket.on('trade-complete', function(data) {
  console.log('trade-complete event');

});

Client.socket.on('add-items-trade', function(data) {
  console.log('add-items-trade event');

  Trade.get_trade_by_id(data.trade_id).add_items(data.items_data, Agent.my_agent.agent_id == data.agent_id);
});

Client.socket.on('remove-items-trade', function(data) {
  console.log('remove-items-trade');

});

Client.socket.on('event-failed', function(data) {
  console.log("ERROR: " + data.error_message);
});
