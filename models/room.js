Room.objects = [];

/**
 * Room model.
 * @param {string} name - name of room
 */
function Room(name, room_id=null) {
  this.name = name;
  this.adjacents = [];
  this.occupants = [];
  this.items = [];

  (Room.objects = Room.objects || []).push(this);
  this.room_id = room_id == null ? Room.objects.length - 1 : room_id;
  server.log('Room ' + this.name + ' Initialized with id ' + this.room_id + '.', 2);
}

Room.load = function(data) {
  new Room(data.name, data.room_id);
}

Room.prototype.serialize = function() {
  var data = {
    name: this.name,
    room_id: this.room_id
  }

  return data;
}

Room.save_all = function() {

  var room_to_adjacents = {};

  server.log("Saving rooms...", 2);
  for (let room of Room.objects) {
    server.log("Saving room " + room.name, 2);
    server.modules.fs.writeFileSync(server.settings.data_dir + '/rooms/' + room.room_id + "_" + room.name + '.json',
      JSON.stringify(room.serialize()), 'utf8');

    room_to_adjacents[room.room_id] = [];
    for (let adj of room.adjacents) {
      room_to_adjacents[room.room_id].push(adj.room_id);
    }
  }

  server.log("Saving Room Connections", 2);

  server.modules.fs.writeFileSync(server.settings.data_dir + '/rooms/room_connections.json',
    JSON.stringify(room_to_adjacents), 'utf8');

  server.log("Rooms saved.", 2);
}

Room.load_all = function() {
  server.log("Loading rooms...", 2);

  server.modules.fs.readdirSync(server.settings.data_dir + '/rooms/').forEach(function(file) {
    if (file !== 'room_connections.json') {
      var data = server.modules.fs.readFileSync(server.settings.data_dir + '/rooms/' + file, 'utf8');
      data = JSON.parse(data);
      server.log("Loading room " + data.name, 2);
      Room.load(data);
    }
  });

  server.log("Loading Room Connections", 2);
  try {
    var connections = JSON.parse(server.modules.fs.readFileSync(server.settings.data_dir + '/rooms/room_connections.json'));

    for (var room_id in connections) {
      var room = Room.get_room_by_id(room_id);
      for (let adj_id of connections[room_id]) {
        var adj = Room.get_room_by_id(adj_id);
        room.connect_room(adj, false);
      }
    }
  }
  catch(err) {
    server.log(err, 1);
  }

  server.log("Rooms loaded.", 2);
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

  server.log('Conected room ' + this.name + ' to room ' + other_room.name + '.', 2);
}


/**
 * Add an agent to this room and send updates.
 * @param {Object} agent - agent object to put in this room.
 */
Room.prototype.add_agent = function(agent, old_room=null) {
  this.occupants.push(agent);
  agent.room = this;
  agent.socket.join(this.room_id);

  if (old_room == null) {
    old_room = this.adjacents[Math.floor(Math.random() * this.adjacents.length)];
  }

  server.send.agent_enter_room(agent, old_room);
  server.send.room_data(agent, this, old_room.room_id);
}


Room.prototype.add_item = function(item) {
  this.items.push(item);
}

Room.prototype.remove_item = function(item) {
  this.items.slice(this.items.indexOf(item), 1);
}

/**
 * Removes an agent from this room.
 * @param {Object} agent - agent to remove
 * @param {Object} new_room - room agent is heading to.
 */
Room.prototype.remove_agent = function(agent, new_room, update_agent=true) {
  var index = this.occupants.indexOf(agent);

  if (index == -1) {
    server.log('Agent ' + agent.name + ' not in room ' + this.name + '.', 0);
    return false;
  }

  agent.socket.leave(this.room_id);
  server.send.agent_exit_room(agent, new_room);

  this.occupants.splice(index, 1);

  if (update_agent) {
    agent.room = null;
  }
}


/**
 * Get data to send to client.
 * @returns {Object}
 */
Room.prototype.get_data = function() {
  var adj_ids = [];
  for (let room of this.adjacents) {
    adj_ids.push({'room_id':room.room_id, 'room_name':room.name});
  }

  return {
    'room_id': this.room_id,
    'room_name': this.name,
    'adjacent_rooms': adj_ids,
    'layout': 0 //TODO
  }
}


/**
 * Get the data for agents in this room.
 * @returns {Object}
 */
Room.prototype.get_agents = function(cur_agent=null) {
  var agents = [];
  for (let agent of this.occupants) {
    if (agent !== cur_agent) {
      agents.push(agent.get_public_data());
    }
  }

  return agents;
}


/**
 * Get the data for items in this room.
 * @returns {Object}
 */
Room.prototype.get_items = function() {
  var items = [];
  for (let item of this.items) {
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

  for (let room of Room.objects) {
    if (room.room_id == room_id) {
      return room;
    }
  }

  server.log('Could not find room with id ' + room_id + '.', 1);
  return null;
}


module.exports = Room;
