Agent.objects = [];

/**
 * Agent model.
 * @param {Object} socket - Socket.io socket object
 * @param {string} username - username of agent
 */
function Agent(username, room=null, inventory=[], id=null) {
  this.name = username;
  this.room = room;
  this.socket = null;
  this.inventory = inventory;

  (Agent.objects = Agent.objects || []).push(this);
  this.agent_id = id == null ? Agent.objects.length - 1 : id;
  server.log('Agent ' + this.name + ' initialized.', 2);

}

Agent.load = function(data) {
  var inventory = [];

  // load items

  new Agent(data.name, server.models.Room.get_room_by_id(data.room_id), inventory, data.agent_id);
}

Agent.login = function(username, socket) {
  for (let agent of Agent.objects) {
    if (agent.name == username) {
      agent.socket = socket;
      server.send.login_complete(agent);
      agent.room.add_agent(agent);
      return agent;
    }
  }

  var agent = new Agent(username, server.models.Room.get_room_by_id(server.settings.default_room_id));
  agent.socket = socket;
  server.send.login_complete(agent);
  agent.room.add_agent(agent);
  return agent;
}

Agent.prototype.serialize = function() {
  var data = {
    name: this.name,
    room_id: this.room.room_id,
    inventory: [],
    agent_id: this.agent_id
  }
  for (let item of this.inventory) {
    data.inventory.push(item.item_id);
  }

  return data;
}


Agent.save_all = function() {
  server.log("Saving agents...", 2);
  for (let agent of Agent.objects) {

    server.log("Saving agent: " + agent.name, 2);

    server.modules.fs.writeFile(server.settings.data_dir + '/agents/' +
        agent.agent_id + '_' + agent.name + '.json',
      JSON.stringify(agent.serialize()), 'utf8', function(err){
        if (err) {
          server.log(err);
        }
      });

  }
  server.log("Agents saved.", 2);
}


Agent.load_all = function() {
  server.log("Loading agents...", 2);

  server.modules.fs.readdirSync(server.settings.data_dir + '/agents/').forEach(function(file) {
    server.modules.fs.readFile(server.settings.data_dir + '/agents/' + file, function read(err, data) {
      if (err) {
        server.log(err);
        return;
      }
      var json = JSON.parse(data);
      server.log("Loading agent " + data.name, 2);
      Agent.load(json);
    });
  });

  server.log("Agents loaded", 2);
}


/**
 * Static function. Find agent with given id.
 * @param {int} agent_id - agent id
 * @returns {Object/null}
 */
Agent.get_agent_by_id = function(agent_id) {
  for (let agent of Agent.objects) {
    if (agent.agent_id == agent_id) {
      return agent;
    }
  }

  server.log('Could not find agent with id ' + agent_id + '.', 0);
  return null;
}


/**
 * Static function. Find agent associated with a socket.
 * @param {Object} socket - Socket.io object
 * @returns {Object/null}
 */
Agent.get_agent_by_socket = function(socket) {
  for (let agent of Agent.objects) {
    if (agent.socket == socket) {
      return agent;
    }
  }

  server.log('Could not find agent with socket ' + socket.id + '.', 0);
  return null;
}


/**
 * Add an item to agent's inventory, update item, and send updates.
 * @param {Object} item - item object
 */
Agent.prototype.add_item_inventory = function(item) {
  this.inventory.push(item);
  item.give_to_agent(this);
}


/**
 * Remove an item from agent inventory, update item, and send updates.
 * @param {Object} item - item object
 */
Agent.prototype.remove_item_inventory = function(item) {
  var index = this.inventory.indexOf(item);

  if (index == -1) {
    server.log('Tried to remove invalid item '+item.name+' from agent '+this.name+'.', 0);
    return false;
  }

  this.inventory.splice(index, 1);
  item.take_from_agent();
}


/**
 * Remove agent from their current room and put in new room.
 * @param {Object} new_room - room to move to
 */
Agent.prototype.move_to_room = function(new_room) {
  var old_room = this.room;
  this.room.remove_agent(this, new_room);
  new_room.add_agent(this, old_room);
}


/**
 * Get the data object for this agent's inventory.
 * @returns {Object}
 */
Agent.prototype.get_inventory_data = function() {
  var dat = [];
  for (var item in this.inventory) {
    dat.push(item.get_data());
  }
  return dat;
}


/**
 * Get the data object for this agent that other agent's can see.
 * @returns {Object}
 */
Agent.prototype.get_public_data = function() {
  return {
    'agent_id': this.agent_id,
    'agent_name': this.name,
    'room_id': this.room.room_id
  }
}


/**
 * Get the data object for this agent that the owner agent can see.
 * @returns {Object}
 */
Agent.prototype.get_private_data = function() {
  var dat = this.get_public_data();
  dat.inventory = this.get_inventory_data();
  return dat;
}


Agent.prototype.logout = function() {
  server.log("Agent " + this.name + " logged out.", 2);
  this.room.remove_agent(this, this.room.adjacents[0], false);

}


module.exports = Agent;

