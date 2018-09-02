Cnode.objects = [];


function Cnode(room, max_agents=4, id=null) {
  this.id = id === null ? Cnode.objects.length : id;
  Cnode.objects.push(this);

  this.max_agents = max_agents;
  this.agents = [];
  this.room = room;

  server.log('Cnode intialized in room ' + room.room_id, 2);
}


Cnode.load = function(data) {

}

Cnode.prototype.serialize = function() {

}

Cnode.save_all = function() {

}

Cnode.load_all = function() {

}

Cnode.prototype.add_agent = function(agent) {

}

Cnode.prototype.remove_agent = function(agent) {

}

Cnode.prototype.get_data = function() {

}

module.exports = Cnode;
