Agent.objects = [];

/**
 * Agent model.
 * @param {string} username - username of agent
 * @param {Object} room - room of agent. Does not put agent in room, simply saves it.
 * @param {[Object]} inventory - list of items that agent owns.
 * @param {int} id - id of agent. If null, one will be assigned.
 */
function Agent(username, room=null, inventory=[], id=null) {
  this.name = username;
  this.room = room;
  this.socket = null;
  this.inventory = inventory;
  this.cnode = null;

  (Agent.objects = Agent.objects || []).push(this);
  this.agent_id = id == null ? Agent.objects.length - 1 : id;
  server.log('Agent ' + this.name + ' initialized.', 2);

}


/**
 * Load and initialize agent object from JSON.
 * @param {dict} data - serialized agent JSON.
 */
Agent.load = function(data) {
  var inventory = [];

  // load items (handled by items)

  new Agent(data.name, server.models.Room.get_room_by_id(data.room_id), inventory, data.agent_id);
}


/**
 * Login an agent. Create new agent or update existing agent with new socket. Send out updates.
 * @param {string} username - username of agent.
 * @param {Object} socket - socket.io client socket object.
 */
Agent.login = function(username, socket) {

  var sel_agent = null;

  for (let agent of Agent.objects) {
    if (agent.name == username) {
      sel_agent = agent;
    }
  }

  if (sel_agent === null) {
    sel_agent = new Agent(username, server.models.Room.get_room_by_id(server.settings.default_room_id));
  }

  sel_agent.socket = socket;
  server.send.login_complete(sel_agent);
  server.control.add_agent_to_room(sel_agent, sel_agent.room);

  return sel_agent;
}


/**
 * Get JSON dictionary representing this agent.
 * @returns {JSON}
 */
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


/**
 * Serialize and write all agents to files.
 */
Agent.save_all = function() {
  server.log("Saving agents...", 2);
  for (let agent of Agent.objects) {

    server.log("Saving agent: " + agent.name, 2);

    server.modules.fs.writeFileSync(server.settings.data_dir + '/agents/' +
        agent.agent_id + '_' + agent.name + '.json',
      JSON.stringify(agent.serialize()), 'utf8');

  }
  server.log("Agents saved.", 2);
}


/**
 * Load all agents from file into memory.
 */
Agent.load_all = function() {
  server.log("Loading agents...", 2);

  server.modules.fs.readdirSync(server.settings.data_dir + '/agents/').forEach(function(file) {
    server.modules.fs.readFile(server.settings.data_dir + '/agents/' + file, function read(err, data) {
      if (err) {
        server.log(err);
        return;
      }
      var json = JSON.parse(data);
      server.log("Loading agent " + json.name, 2);
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

  server.log('Could not find agent with id ' + agent_id + '.', 1);
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

  server.log('Could not find agent with socket ' + socket.id + '.', 1);
  return null;
}


/**
 * Add an item to agent's inventory.
 * @param {Object} item - item object
 */
Agent.prototype.add_item_inventory = function(item) {
  this.inventory.push(item);
}


/**
 * Remove an item from agent inventory.
 * @param {Object} item - item object
 */
Agent.prototype.remove_item_inventory = function(item) {
  var index = this.inventory.indexOf(item);

  if (index == -1) {
    server.log('Tried to remove invalid item '+item.name+' from agent '+this.name+'.', 0);
    return false;
  }

  this.inventory.splice(index, 1);
}


/**
 * Put agent in room.
 * @param {Object} new_room - room to move to
 */
Agent.prototype.put_in_room = function(new_room) {
  this.room = new_room;
}


/**
 * Remove agent from room.
 */
Agent.prototype.remove_from_room = function() {
  this.room = null;
}


/**
 * Get the data object for this agent's inventory.
 * @returns {Object}
 */
Agent.prototype.get_inventory_data = function() {
  var dat = [];
  for (let item of this.inventory) {
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


/**
 * Called on agent logout.
 */
Agent.prototype.logout = function() {
  server.log("Agent " + this.name + " logged out.", 2);

  server.control.remove_agent_from_room(this, null, false);
}


/**
 *
 */
Agent.prototype.join_cnode = function(cnode) {
  this.cnode = cnode;
}


/**
 *
 */
Agent.prototype.leave_cnode = function() {
  this.cnode = null;
}


module.exports = Agent;
