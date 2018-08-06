server.send = {}

/**
 * Send an event failure to a client.
 * @param {Object} socket - Socket.io object
 * @param {string} eventName - name of event that failed
 * @param {string} errorMessage - error details
 */
server.send.event_failed = function(socket, eventName, errorMessage) {
    server.log(eventName + ": " + errorMessage, 1);
    socket.emit('event-failed', {'event_name': eventName, 'error_message': errorMessage});
}


/**
 * Send login success message to client.
 * @param {Object} agent - agent object associated with client
 */
server.send.login_complete = function(agent) {
    server.log('Sent login confirmation to agent ' + agent.name + ".", 2);
    agent.socket.emit('login-complete', {'agent_data': agent.get_private_data()});
}


/**
 * Notify all agents in a room that agent entered the room.
 * @param {Object} agent - agent object
 */
server.send.agent_enter_room = function(agent) {
    server.log("Agent " + agent.name + " entered room " + agent.room.name + ".", 2);
    agent.socket.to(agent.room.room_id).emit('agent-enter-room', {'agent_data': agent.get_public_data()});
}


/**
 * Notify all agents in a room that agent left the room.
 * @param {Object} agent - agent object
 * @param {Object} newRoom - room object that agent is exiting to.
 */
server.send.agent_exit_room = function(agent, newRoom) {
    server.log("Agent " + agent.name + " left room " + agent.room.name + ".", 2);
    agent.socket.to(agent.room.room_id).emit('agent-exit-room',
            {'agent_id': agent.agent_id, 'room_id': newRoom.room_id});
}


/**
 * Give all room data to client.
 * @param {Object} socket - Socket.io object
 * @param {Object} room - room object
 */
server.send.room_data = function(socket, room) {
    server.log("Agent " + agent.name + " got room data for room " + room.name + ".", 2);
    socket.emit('room-data', {'room_data': room.get_data(), 'agents': room.get_agents()});
}


/**
 * Add a list of items to an agent's inventory.
 * @param {Object} agent - agent object
 * @param {Object} items - array of items to add to inventory
 */
server.send.add_items_inventory = function(agent, items) {
    var dat = [];
    for (var item in items) {
        dat.push(item.get_data());
    }

    server.log("Gave items " + JSON.stringify(dat) + " to agent " + agent.name + ".", 2);

    agent.socket.emit('add-items-inventory', {'items_data': dat});
}


/**
 * Remove a list of items from an agent's inventory. Assumes valid data.
 * @param {Object} agent - agent object
 * @param {Object} items - array of items to be removed from agent's inventory.
 */
server.send.remove_items_inventory = function(agent, items) {
    var dat = [];
    for (var item in items) {
        dat.push(item.item_id);
    }

    server.log("Remove items " + JSON.stringify(dat) + " from agent " + agent.name + ".", 2);

    agent.socket.emit('remove-items-inventory', {'item_ids': dat});
}


/**
 * Add a list of items to a room.
 * @param {Object} items - item objects
 * @param {Object} room - room object
 */
server.send.add_items_room = function(items, room) {
    var dat = [];
    for (var item in items) {
        dat.push(item.get_data());
    }

    server.log("Put items " + JSON.stringify(dat) + " to room " + room.name + ".", 2);

    server.modules.io.in(room.room_id).emit('add-items-room', {'items_data': dat});
}


/**
 * Remove a list of items from a room. Assumes valid data.
 * @param {Object} items - item objects
 * @param {Object} room - room object
 */
server.send.remove_items_room = function(items, room) {
    var dat = [];
    for (var item in items) {
        dat.push(item.item_id);
    }

    server.log("Remove items " + JSON.stringify(dat) + " from room " + room.name + ".", 2);

    server.modules.io.in(room.room_id).emit('remove-items-room', {'item_ids': dat});
}


server.send.add_items_trade = function(socket, trade, items) {

}


server.send.remove_items_trade = function(socket, trade, items) {

}


server.send.agent_ready_trade = function(socket, trade, agent, readyStatus) {

}


server.send.trade_requested = function(socket, trade) {

}


server.send.trade_accepted = function(socket, trade) {

}


server.send.trade_declined = function(socket, trade) {

}


server.send.trade_complete = function(socket, trade) {

}

