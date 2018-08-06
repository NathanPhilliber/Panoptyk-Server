
function Agent(socket, username) {
  this.agent_id = null;
  this.name = username;
  this.room = null;
  this.socket = socket;
  this.inventory = [];

  (Agent.objects = Agent.objects || []).push(this);
  server.log("Agent Initialized");

  server.send.login_complete(this);
}

Agent.prototype.move_to_room = function(newRoom) {
    agent.room.remove_agent(this, newRoom);
    newRoom.add_agent(this);
}

Agent.prototype.get_inventory_data() {
    var dat = [];
    for (var item in this.inventory) {
        dat.push(item.get_data());
    }
    return dat;
}

Agent.prototype.get_public_data = function() {
    return {
        'agent_id': this.agent_id,
        'agent_name': this.name,
        'room_id': this.room.room_id
    };
}

Agent.prototype.get_private_data = function() {
    var dat = this.get_public_data();
    dat.inventory = this.get_inventory_data();
    return dat;
}

module.exports = Agent;
