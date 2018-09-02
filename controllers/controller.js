var Controller = {};

/**
 * Add items to agent's inventory. Does validation.
 * @param {Object} agent - agent to give items to.
 * @param {[Object]} items - list of items to give to agent.
 */
Controller.add_items_to_agent_inventory = function(agent, items) {

  if (agent === null) {
    server.log("Cannot give items to null agent", 0);
    return;
  }

  if (items === null || items.length == 0) {
    server.log("Cannot give no items to agent", 0);
    return;
  }

  for (let item of items) {
    if (item.room !== null || item.agent !== null) {
      server.log("Cannot give item to agent, item not available " + item.name, 0);
      return;
    }
  }

  for (let item of items) {
    agent.add_item_inventory(item);
    item.give_to_agent(agent);
  }

  server.send.add_items_inventory(agent, items);
}


/**
 * Remove items from agent's inventory. Does validation.
 * @params {[Object]} items - list of items to remove from agent.
 */
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


/**
 * Move agent to room. Remove agent from old room, add to new room. Does validation.
 * @param {Object} agent - agent object.
 * @param {Object} new_room - new room to move agent to.
 */
Controller.move_agent_to_room = function(agent, new_room) {
  if (agent === null || new_room === null || agent.room === null) {
    server.log("Cannot move agent to room", 0);
    return;
  }

  var old_room = agent.room;

  if (!old_room.is_connected_to(new_room)) {
    server.log("Cannot move agent. " + old_room.name + " not adjacent to " + new_room.name, 0);
    return;
  }

  Controller.remove_agent_from_room(agent, new_room);
  Controller.add_agent_to_room(agent, new_room, old_room);
}


/**
 * Add agent to a room. Does validation.
 * @param {Object} agent - agent to add to room.
 * @param {Object} new_room - room to move agent to.
 * @param {Object} old_room - room agent is coming from. (Optional).
 */
Controller.add_agent_to_room = function(agent, new_room, old_room=null) {
  if (new_room === null || agent === null) {
    server.log("Cannot add agent to room", 0);
  }

  agent.put_in_room(new_room);
  new_room.add_agent(agent);

  agent.socket.join(new_room.room_id);

  server.send.agent_enter_room(agent, old_room);
  server.send.room_data(agent, new_room, old_room);
}


/**
 * Remove agent from a room. Does validation.
 * @param {Object} agent - agent to remove from room.
 * @param {Object} new_room - room agent is moving to. (Optional).
 */
Controller.remove_agent_from_room = function(agent, new_room=null) {
  if (agent === null) {
    server.log("Cannot remove null agent from room", 0);
    return;
  }

  var old_room = agent.room;

  if (old_room === null) {
    server.log("Cannot remove agent " + agent.name + " from room, agent is not in room.", 0);
    return;
  }

  agent.socket.leave(old_room.room_id);

  server.send.agent_exit_room(agent, new_room);

  agent.remove_from_room();
  old_room.remove_agent(agent);
}


/**
 * Add items to a room. Does validation.
 * @param {Object} room - room to add items to.
 * @param {[items]} items - list of items to add to room.
 * @param {Object} by_agent - agent responsible for putting items in room. (Optional).
 */
Controller.add_items_to_room = function(room, items, by_agent=null) {
  if (room === null || items === null || items.length == 0) {
    server.log("Cannot add items to room", 0);
    return;
  }

  for (let item of items) {
    if (item.room !== null || item.agent !== null) {
      server.log("Cannot add item " + item.item_id  + " to room. Item not available,", 0);
      return;
    }
  }

  for (let item of items) {
    room.add_item(item);
    item.put_in_room(room);
  }

  server.send.add_items_room(items, room, by_agent);
}


/**
 * Remove items from a room. Does validation.
 * @param {[Object]} items - list of items to remove from room.
 * @param {Object} by_agent - agent taking the items from room. (Optional).
 */
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
