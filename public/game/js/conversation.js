current_conversation = -1;

function Conversation(conversation_id, max_agents, agent_ids) {
  this.conversation_id = conversation_id;
  this.max_agents = max_agents;

  this.sprite = graphics.add.sprite(Math.random()*(game.canvas.width-200)+100, Math.random()*(game.canvas.height-200)+100, 'conversation');
  this.sprite.setOrigin(0.5, 0.5);
  this.sprite.setInteractive();

  var conversation = this;

  this.sprite.on('pointerdown', function(ev) {
    console.log('entering conversation ' + conversation_id);
    Client.send.joinConversation(conversation);
  });

  this.agents = [];
  for (let agent_id of agent_ids) {
    //this.agents.push(current_room.get_agent(agent_id));
    this.add_agent(current_room.get_agent(agent_id));
  }

  console.log("Conversation " + this.conversation_id + " initialized.");
}

Conversation.prototype.destroy = function() {
  this.sprite.destroy();
}

Conversation.prototype.add_agent = function(agent) {
  this.agents.push(agent);
  var pos = this.get_spot();
  agent.move(pos.x, pos.y);

  if (agent == Agent.my_agent) {
    agent.conversation = this;
    loadTradeMeetingSpot("Meeting Location", this.agents);
  }
  else if(Agent.my_agent.conversation == this){
    document.getElementById("i_div_meetingSpotAgents").appendChild(getAgentMeetingRow(agent));
  }
}

Conversation.prototype.remove_agent = function(agent) {
  var index = this.agents.indexOf(agent);

  if (index == -1) {
    console.log("could not remove agent, agent not in conversation " + this.conversation_id);
    return;
  }

  this.agents.splice(index, 1);
  agent.move(Math.random()*game.canvas.width, Math.random()*game.canvas.height);

  if (agent == Agent.my_agent) {
    clearTradeMeetingSpot();
  }
  else if(Agent.my_agent.conversation == this) {
    removeAgentMeetingRow(agent.agent_id);
  }
}


Conversation.prototype.get_spot = function() {
  return {
    x: Math.random()*this.sprite.width + this.sprite.x - this.sprite.width/2,
    y: Math.random()*this.sprite.height + this.sprite.y - this.sprite.height/2
  }
}
