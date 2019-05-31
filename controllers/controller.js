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
    if (item.room !== null || (item.agent !== null)) {
      server.log("Cannot give item to agent, item not available " + item.name, 0);
      return;
    }
  }

  var added_items = [];

  for (let item of items) {
    added_items.push(item);

    agent.add_item_inventory(added_items[added_items.length-1]);
    added_items[added_items.length-1].give_to_agent(agent);
  }

  //server.send.add_items_inventory(agent, added_items);
}

/**
 * Add info to agent's knowledge. Does validation.
 * @param {Object} agent - agent to give items to.
 * @param {[Object]} info - list of info to give to agent.
 */
Controller.add_info_to_agent_inventory = function(agent, info) {

  if (agent === null) {
    server.log("Cannot give info to null agent", 0);
    return;
  }

  if (info === null || info.length == 0) {
    server.log("Cannot give no info to agent", 0);
    return;
  }

  for (let i of info) {
    if ((i.owner !== null)) {
      server.log("Cannot give info to agent, info not available " + i.id, 0);
      return;
    }
  }

  var added_info = [];

  for (let i of info) {
    added_info.push(i);

    agent.add_info_knowledge(added_info[added_info.length-1]);
    added_info[added_info.length-1].give_to_agent(agent);
  }

  //server.send.add_info_inventory(agent, added_info);
}


/**
 * Remove items from agent's inventory. Does validation.
 * @params {[Object]} items - list of items to remove from agent.
 */
Controller.remove_items_from_agent_inventory = function(items) {
  if (items === null || items.length == 0) {
    server.log("Cannot remove no items from agent", 1);
    return;
  }

  var agent = items[0].agent;

  for (let item of items) {
    if (item.agent !== agent) {
      server.log("Cannot remove items from agent inventory, not all items from same agent", 0);
      return;
    }
  }

  var removed_items = [];

  for (let item of items) {
    item.agent.remove_item_inventory(item);
    item.take_from_agent();
    removed_items.push(item);
  }

  server.send.remove_items_inventory(agent, removed_items);
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
    server.log("Cannot add agent to room", 0, "controller.js");
    return;
  }

  Controller.give_info_to_agents(new_room.occupants,
    (agent.name + " entered room " + new_room.name));


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

  var time = server.clock.get_datetime();
  var info = new server.models.Info.ACTION.DEPART.create(agent, {0: time, 1: agent.agent_id, 2: old_room.room_id});

  Controller.give_info_to_agents(old_room.occupants, info);

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


/**
 * Cancel all trades containing an agent.
 * @param {Object} agent - agent object.
 */
Controller.end_all_trades_with_agent = function(agent) {
  for (let trade of server.models.Trade.get_active_trades_with_agent(agent)) {
    Controller.cancel_trade(trade);
  }
}


/**
 * Create a trade and send request to appropriate agent.
 * 2param {Object} cnode - cnode object containing both agents.
 * @param {Object} from_agent - agent object making request.
 * @param {Object} to_agent - agent object getting request.
 * @returns {Object} new trade object.
 */
Controller.create_trade = function(cnode, from_agent, to_agent) {
  var trade = new server.models.Trade(from_agent, to_agent, cnode);

  server.send.trade_requested(to_agent.socket, trade);

  return trade;
}


/**
 * Accept a trade and send updates to both agents.
 * Trade is now ready to accept items.
 * @param {Object} trade - trade object.
 */
Controller.accept_trade = function(trade) {
  server.send.trade_accepted(trade.agent_ini.socket, trade, trade.agent_res);
  server.send.trade_accepted(trade.agent_res.socket, trade, trade.agent_ini);
  trade.set_status(2);
}


/**
 * Cancel a trade, send updates to agents, and close out trade.
 * @param {Object} trade - trade object.
 */
Controller.cancel_trade = function(trade) {
  server.send.trade_declined(trade.agent_ini.socket, trade);
  server.send.trade_declined(trade.agent_res.socket, trade);
  trade.set_status(0);
  trade.cleanup();
}


/**
 * Do the trade. Send updates to agents, move items, close out trade, and give observation
 *    info to all agents in room.
 * @param {Object} trade - trade object.
 */
Controller.perform_trade = function(trade) {
  server.log("Ending trade " + trade.trade_id, 2);

  server.send.trade_complete(trade.agent_ini.socket, trade);
  server.send.trade_complete(trade.agent_res.socket, trade);

  Controller.remove_items_from_agent_inventory(trade.items_ini, true);
  Controller.remove_items_from_agent_inventory(trade.items_res, true);

  Controller.add_items_to_agent_inventory(trade.agent_ini, trade.items_res, true);
  Controller.add_items_to_agent_inventory(trade.agent_res, trade.items_ini, true);

  trade.set_status(1);
  trade.cleanup();

  // Info object prep
  var items_ini_str = [];
  var items_res_str = [];

  for (let item of trade.items_ini) {
    items_ini_str.push(item.name);
  }
  for (let item of trade.items_res) {
    items_res_str.push(item.name);
  }

  Controller.give_info_to_agents(trade.cnode.room.occupants,
    (trade.agent_ini.name + " (" + items_ini_str.join(", ") + ") traded with " +
     trade.agent_res.name + " (" + items_res_str.join(", ") + ")"));

  server.log("Successfully completed trade " + trade.trade_id, 2);
}


/**
 * Add items to a trade and send updates.
 * @param {Object} trade - trade object.
 * @param {[Object]} items - array of items to add.
 * @param {Object} owner_agent - agent adding the items.
 */
Controller.add_items_to_trade = function(trade, items, owner_agent) {
  server.log("Adding items to trade " + trade.trade_id  + "...", 2);

  Controller.set_trade_unready_if_ready(trade, trade.agent_ini);
  Controller.set_trade_unready_if_ready(trade, trade.agent_res);

  trade.add_items(items, owner_agent);

  server.send.add_items_trade(trade.agent_ini.socket, trade, items, owner_agent);
  server.send.add_items_trade(trade.agent_res.socket, trade, items, owner_agent);

  server.log("Successfully added items to trade " + trade.trade_id, 2);
}


/**
 * Remove items from a trade and send updates.
 * @param {Object} trade - trade object.
 * @param {[Object]} items - array of items to remove.
 * @param {Object} owner_agent - agent removing the items.
 */
Controller.remove_items_from_trade = function(trade, items, owner_agent) {
  server.log("Removing items from trade " + trade.trade_id  + "...", 2);

  Controller.set_trade_unready_if_ready(trade, trade.agent_ini);
  Controller.set_trade_unready_if_ready(trade, trade.agent_res);

  trade.remove_items(items, owner_agent);

  server.send.remove_items_trade(trade.agent_ini.socket, trade, items, owner_agent);
  server.send.remove_items_trade(trade.agent_res.socket, trade, items, owner_agent);

  server.log("Successfully removed items from trade " + trade.trade_id, 2);
}


/**
 * Update agent trade ready status. If both agents are ready, trade will commence and end.
 * @param {Object} trade - trade object.
 * @param {Object} agent - agent object.
 * @param {boolean} rstatus - true if ready, false if not ready.
 */
Controller.set_trade_agent_status = function(trade, agent, rstatus) {
  var end_trade = trade.set_agent_ready(agent, rstatus);

  server.send.agent_ready_trade(
    agent == trade.agent_ini ? trade.agent_ini.socket : trade.agent_res.socket,
    trade, agent, rstatus);

  if (end_trade) {
    Controller.perform_trade(trade);
  }
}


/**
 * Will turn an agent ready status to false if it is true.
 * @param {Object} trade - trade object.
 * @param {Object} agent - agent object.
 */
Controller.set_trade_unready_if_ready = function(trade, agent) {
  if (trade.agent_ini == agent && trade.status_ini) {
    Controller.set_trade_agent_status(trade, agent, false);
  }
  else if (trade.agent_res == agent && trade.status_res) {
    Controller.set_trade_agent_status(trade, agent, false);
  }
}


/**
 * Give a piece of info to an array of agents.
 * @param {[Object]} agents - agents to give info to.
 * @param {string} info - info string.
 */
Controller.give_info_to_agents = function(agents, info) {

  var time = server.clock.get_datetime();

  for (let agent of agents) {
    var cpy = info.make_copy(agent, time);
    Controller.add_info_to_agent_inventory(agent, [cpy]);
  }
}

module.exports = Controller;
