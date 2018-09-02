var Controller = {};

Controller.add_items_to_agent_inventory = function(agent, items) {

  if (agent === null) {
    server.log("Cannot give items to null agent", 0);
    return;
  }

  for (let item of items) {
    agent.add_item_inventory(item);
    item.give_to_agent(agent);
  }

  server.send.add_items_inventory(agent, items);
}

Controller.remove_items_from_agent_inventory = function(items) {
  if (items === null || items.length == 0) {
    server.log("Cannot remove no items from agent", 0);
    return;
  }

  var agent = items[0].agent;

  for (let item of items) {
    if (item.agent !== agent) {
      server.log("Cannot remove items from agent inventory, not all items from same agent", 0);
      return;
    }
  }

  for (let item of items) {
    item.agent.remove_item_inventory(item);
    item.take_from_agent();
  }

  server.send.remove_items_inventory(agent, items);
}

Controller.move_agent_to_room = function(agent, new_room) {
  var old_room = agent.room;

  Controller.remove_agent_from_room(agent, new_room);
  Controller.add_agent_to_room(agent, new_room, old_room);
}

Controller.add_agent_to_room = function(agent, new_room, old_room=null) {
  agent.put_in_room(new_room);
  new_room.add_agent(agent);

  agent.socket.join(new_room.room_id);

  server.send.agent_enter_room(agent, old_room);
  server.send.room_data(agent, new_room, old_room);
}

Controller.remove_agent_from_room = function(agent, new_room=null) {
  var old_room = agent.room;

  agent.socket.leave(old_room.room_id);

  server.send.agent_exit_room(agent, new_room);

  agent.remove_from_room();
  old_room.remove_agent(agent);
}

Controller.add_items_to_room = function(room, items, by_agent=null) {
  for (let item of items) {
    room.add_item(item);
    item.put_in_room(room);
  }

  server.send.add_items_room(items, room, by_agent);
}

Controller.remove_items_from_room = function(items, by_agent=null) {
   if (items === null || items.length == 0) {
    server.log("Cannot remove no items from agent", 0);
    return;
  }

  var room = items[0].room;

  for (let item of items) {
    if (item.room !== room) {
      server.log("Cannot remove items from room, not all items from same room", 0);
      return;
    }
  }

  for (let item of items) {
    room.remove_item(item);
    item.remove_from_room();
  }

  server.send.remove_items_room(items, room, by_agent);
}


module.exports = Controller;
