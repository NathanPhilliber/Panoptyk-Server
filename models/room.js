/**
 * Room model.
 * @param {string} name - name of room
 */
function Room(name) {
  this.name = name;
  this.adjacents = [];
  this.occupants = [];
  this.items = [];

  (Room.objects = Room.objects || []).push(this);
  this.room_id = Room.objects.length;
  server.log("Room " + this.name + " Initialized.", 2);
}


/**
 * Allow movement from this room to another room.
 * @param {Object} other_room - room object to connect
 * @param {boolean} two_way - allow movement from other room to this room, default true
 */
Room.prototype.connect_room = function(other_room, two_way=true) {
    this.adjacents.push(other_room);
    if (two_way) {
        other_room.connect_room(this, false);
    }

    server.log("Conected room " + this.name + " to room " + other_room.name + ".", 2);
}


/**
 * Add an agent to this room and send updates.
 * @param {Object} agent - agent object to put in this room.
 */
Room.prototype.add_agent = function(agent, old_room) {
    occupants.push(agent);
    agent.room = this;

    server.send.agent_enter_room(agent, old_room);
    server.send.room_data(agent.socket, this);
}


/**
 * Removes an agent from this room.
 * @param {Object} agent - agent to remove
 * @param {Object} new_room - room agent is heading to.
 */
Room.prototype.remove_agent = function(agent, new_room) {
    var index = this.occupants.indexOf(agent);

    if (index == -1) {
        server.log("Agent " + agent.agent_name + " not in room " + this.name + ".", 0);
        return false;
    }

    server.send.agent_exit_room(agent, new_room);

    this.occupants.splice(index, 1);
    agent.room = null;
}


/**
 * Get data to send to client.
 * @returns {Object}
 */
Room.prototype.get_data = function() {
    return {
        'room_id': this.room_id,
        'adjacent_rooms': this.adjacents,
        'layout': 0 //TODO
    }
}


/**
 * Get the data for agents in this room.
 * @returns {Object}
 */
Room.prototype.get_agents = function() {
    var agents = [];
    for (var agent in this.occupants) {
        agents.push(agent.get_public_data());
    }
    return agents;
}


/**
 * Get the data for items in this room.
 * @returns {Object}
 */
Room.prototype.get_items = function() {
    var items = [];
    for (var item in this.items) {
        items.push(item.get_data());
    }
    return items;
}


/**
 * Static function. Get a room by id.
 * @param room_id {int} - id of room.
 * @returns {Object/null}
 */
Room.get_room_by_id = function(room_id) {
    for (var room in Room.objects) {
        if (room.room_id == room_id) {
            return room;
        }
    }

    server.log("Could not find room with id " + room_id + ".", 1);
    return null;
}

module.exports = Room;
