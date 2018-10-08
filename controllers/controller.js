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
Controller.remove_agent_from_room = function(agent, new_room=null, update_agent_model=true) {
  if (agent === null) {
    server.log("Cannot remove null agent from room", 0);
    return;
  }

  var old_room = agent.room;

  if (old_room === null) {
    server.log("Cannot remove agent " + agent.name + " from room, agent is not in room.", 0);
    return;
  }

  Controller.remove_agent_from_cnode_if_in(agent);

  agent.socket.leave(old_room.room_id);

  server.send.agent_exit_room(agent, new_room);

  if (update_agent_model) {
    agent.remove_from_room();
  }

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


/**
 * Add an agent to a cnode. Does validation.
 * @param {Object} cnode - cnode agent wants to join.
 * @param {Object} agent - agent object
 */
Controller.add_agent_to_cnode = function(cnode, agent) {
  Controller.remove_agent_from_cnode_if_in(agent);

  server.log("Adding agent " + agent.name + " to cnode " + cnode.cnode_id, 2);
  agent.join_cnode(cnode);
  cnode.add_agent(agent);

  server.send.agent_join_cnode(agent);
}


/**
 * Remove an agent from a cnode. Does validation.
 * @param {Object} cnode - cnode agent wants to leave.
 * @param {Object} agent - agent object
 */
Controller.remove_agent_from_cnode = function(cnode, agent) {
  server.log("Removing agent " + agent.name + " from cnode " + cnode.cnode_id, 2);

  Controller.end_all_trades_with_agent(agent);

  agent.leave_cnode();
  cnode.remove_agent(agent);

  server.send.agent_leave_cnode(agent, cnode);
}


/**
 * Remove agent from their cnode if they are in one. Otherwise do nothing.
 * @param {Object} agent - agent object
 */
Controller.remove_agent_from_cnode_if_in = function(agent) {
  if (agent.cnode !== null) {
    Controller.remove_agent_from_cnode(agent.cnode, agent);
  }
}

Controller.end_all_trades_with_agent = function(agent) {
  for (let trade of server.models.Trade.get_active_trades_with_agent(agent)) {
    Controller.cancel_trade(trade);
  }
}

Controller.create_trade = function(cnode, from_agent, to_agent) {
  var trade = new server.models.Trade(from_agent, to_agent, cnode);

  server.send.trade_requested(to_agent.socket, trade);

  return trade;
}


Controller.accept_trade = function(trade) {
  server.send.trade_accepted(trade.agent_ini.socket, trade, trade.agent_res);
  server.send.trade_accepted(trade.agent_res.socket, trade, trade.agent_ini);
  trade.set_status(2);
}


Controller.cancel_trade = function(trade) {
  server.send.trade_declined(trade.agent_ini.socket, trade);
  server.send.trade_declined(trade.agent_res.socket, trade);
  trade.set_status(0);
  trade.cleanup();
}


Controller.perform_trade = function(trade) {
  server.log("Ending trade " + trade.trade_id, 2);

  server.send.trade_complete(trade.agent_ini.socket, trade);
  server.send.trade_complete(trade.agent_res.socket, trade);

  Controller.remove_items_from_agent_inventory(trade.items_ini);
  Controller.remove_items_from_agent_inventory(trade.items_res);

  Controller.add_items_to_agent_inventory(trade.agent_ini, trade.items_res);
  Controller.add_items_to_agent_inventory(trade.agent_res, trade.items_ini);

  trade.set_status(1);
  trade.cleanup();

  server.log("Successfully completed trade " + trade.trade_id, 2);
}

Controller.add_items_to_trade = function(trade, items, owner_agent) {
  server.log("Adding items to trade " + trade.trade_id  + "...", 2);

  Controller.set_trade_unready_if_ready(trade, owner_agent);

  trade.add_items(items, owner_agent);

  server.send.add_items_trade(trade.agent_ini.socket, trade, items, owner_agent);
  server.send.add_items_trade(trade.agent_res.socket, trade, items, owner_agent);

  server.log("Successfully added items to trade " + trade.trade_id, 2);
}

Controller.remove_items_from_trade = function(trade, items, owner_agent) {
  server.log("Removing items from trade " + trade.trade_id  + "...", 2);

  Controller.set_trade_unready_if_ready(trade, owner_agent);

  trade.remove_items(items, owner_agent);

  server.send.remove_items_trade(trade.agent_ini.socket, trade, items, owner_agent);
  server.send.remove_items_trade(trade.agent_res.socket, trade, items, owner_agent);

  server.log("Successfully removed items from trade " + trade.trade_id, 2);
}

Controller.set_trade_agent_status = function(trade, agent, rstatus) {
  var end_trade = trade.set_agent_ready(agent, rstatus);

  server.send.agent_ready_trade(
    agent == trade.agent_ini ? trade.agent_ini.socket : trade.agent_res.socket,
    trade, agent, rstatus);

  if (end_trade) {
    Controller.perform_trade(trade);
  }
}

Controller.set_trade_unready_if_ready = function(trade, agent) {
  if (trade.agent_ini == agent && trade.status_ini) {
    Controller.set_trade_agent_status(trade, agent, false);
  }
  else if (trade.agent_res == agent && trade.status_res) {
    Controller.set_trade_agent_status(trade, agent, false);
  }
}

module.exports = Controller;
