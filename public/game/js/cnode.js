current_cnode = -1;

function Cnode(cnode_id, max_agents, agent_ids) {
  this.cnode_id = cnode_id;
  this.max_agents = max_agents;

  this.agents = [];
  for (let agent_id of agent_ids) {
    this.agents.push(current_room.get_agent(agent_id));
  }

  this.sprite = graphics.add.sprite(Math.random()*(game.canvas.width-200)+100, Math.random()*(game.canvas.height-200)+100, 'cnode');
  this.sprite.setOrigin(0.5, 0.5);
  this.sprite.setInteractive();

  var cnode = this;

  this.sprite.on('pointerdown', function(ev) {
    console.log('entering cnode ' + cnode_id);
    Client.send.joinCnode(cnode);
  });

  console.log("Cnode " + this.cnode_id + " initialized.");
}

Cnode.prototype.destroy = function() {
  this.sprite.destroy();
}
