Cnode.objects = [];


function Cnode(room, max_agents=4, id=null) {
  this.cnode_id = id === null ? Cnode.objects.length : id;
  Cnode.objects.push(this);

  this.max_agents = max_agents;
  this.agents = [];
  this.room = room;
  room.add_cnode(this);

  server.log('Cnode intialized in room ' + room.room_id, 2);
}


Cnode.load = function(data) {
  new Cnode(server.models.Room.get_room_by_id(data.room_id), data.max_agents, data.cnode_id);
}

Cnode.prototype.serialize = function() {
  return {
    room_id: this.room.room_id,
    max_agents: this.max_agents,
    cnode_id: this.cnode_id
  }
}

Cnode.save_all = function() {
  server.log("Saving cnodes...", 2);
  for (let cnode of Cnode.objects) {
    server.log("Saving cnode " + cnode.cnode_id, 2);
    server.modules.fs.writeFileSync(server.settings.data_dir + '/cnodes/' + cnode.cnode_id + '_cnode.json',
      JSON.stringify(cnode.serialize()), 'utf8');
  }

  server.log("Cnodes saved.", 2);
}

Cnode.load_all = function() {
  server.log("Loading cnodes...", 2);

  server.modules.fs.readdirSync(server.settings.data_dir + '/cnodes/').forEach(function(file) {
    var data = server.modules.fs.readFileSync(server.settings.data_dir + '/cnodes/' + file, 'utf8');
    data = JSON.parse(data);
    server.log("Loading cnode " + data.cnode_id, 2);
    Cnode.load(data);
  });

  server.log("Cnodes loaded.", 2);
}

Cnode.prototype.add_agent = function(agent) {
  this.agents.push(agent);
}

Cnode.prototype.remove_agent = function(agent) {
  var index = this.agents.indexOf(agent);

  if (index == -1) {
    server.log("Tried to remove agent not in cnode " + cnode.cnode_id, 0);
    return;
  }

  this.agents.splice(index);
}

Cnode.prototype.get_agent_ids = function(ignore_agent=null) {
  var ids = [];
  for (let agent of this.agents) {
    if (agent !== ignore_agent) {
      ids.push(agent.agent_id);
    }
  }

  return ids;
}

Cnode.prototype.get_data = function() {
  return {
    cnode_id: this.cnode_id,
    max_agents: this.max_agents,
    agent_ids: this.get_agent_ids()
  }
}

Cnode.get_cnode_by_id = function(cnode_id) {
  for (let cnode of Cnode.objects) {
    if (cnode.cnode_id == cnode_id) {
      return cnode;
    }
  }

  server.log("Could not find cnode with id " + cnode_id, 1);
  return null;
}

module.exports = Cnode;
