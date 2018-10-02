current_cnode = -1;

function Cnode(cnode_id, max_agents, agent_ids) {
  this.cnode_id = cnode_id;
  this.max_agents = max_agents;

  this.sprite = graphics.add.sprite(Math.random()*(game.canvas.width-200)+100, Math.random()*(game.canvas.height-200)+100, 'cnode');
  this.sprite.setOrigin(0.5, 0.5);
  this.sprite.setInteractive();

  var cnode = this;

  this.sprite.on('pointerdown', function(ev) {
    console.log('entering cnode ' + cnode_id);
    Client.send.joinCnode(cnode);
  });

  this.agents = [];
  for (let agent_id of agent_ids) {
    //this.agents.push(current_room.get_agent(agent_id));
    this.add_agent(current_room.get_agent(agent_id));
  }

  console.log("Cnode " + this.cnode_id + " initialized.");
}

Cnode.prototype.destroy = function() {
  this.sprite.destroy();
}

Cnode.prototype.add_agent = function(agent) {
  this.agents.push(agent);
  var pos = this.get_spot();
  agent.move(pos.x, pos.y);

  if (agent == Agent.my_agent) {
    loadTradeMeetingSpot("Meeting Location", this.agents);
  }
}

Cnode.prototype.remove_agent = function(agent) {
  var index = this.agents.indexOf(agent);

  if (index == -1) {
    console.log("could not remove agent, agent not in cnode " + this.cnode_id);
    return;
  }

  this.agents.splice(index, 1);
  agent.move(Math.random()*game.canvas.width, Math.random()*game.canvas.height);

  if (agent == Agent.my_agent) {
    clearTradeMeetingSpot();
  }
}


Cnode.prototype.get_spot = function() {
  return {
    x: Math.random()*this.sprite.width + this.sprite.x - this.sprite.width/2,
    y: Math.random()*this.sprite.height + this.sprite.y - this.sprite.height/2
  }
}
