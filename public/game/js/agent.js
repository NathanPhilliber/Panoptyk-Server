
Agent.move_speed = 2.5;

function Agent(id, username, my_agent=false) {
  this.agent_id = id;
  this.name = username;
  this.x = Math.random() * (game.canvas.width-150) + 75;
  this.y = Math.random() * (game.canvas.height-150) + 75;
  this.graphics = graphics.add.graphics(0,0);
  this.conversation = null;
  this.trades = {};

  this.sprite = graphics.add.sprite(this.x, this.y, my_agent ? 'agent' : 'agent_other');
  this.sprite.setOrigin(0.5, 0);
  this.sprite.setInteractive();

  this.title = graphics.add.text(this.x, this.y, this.name, {fill:'#fff', font:'16px Arial' });
  this.title.setOrigin(0.5, 1);

  this.sprite.on('pointerdown', function(ev) {
    console.log('requesting conversation ' + id);
    Client.send.requestConversation(id);
  });

  console.log("Agent Initialized (" + id + ", " + username + ")");

  //this.draw(my_agent);
  if (my_agent) {
    Agent.my_agent = this;
  }
}

// Agent.prototype.draw = function(my_agent) {
//   this.sprite = graphics.add.sprite(this.x, this.y, my_agent ? 'agent' : 'agent_other');
//   this.sprite.setOrigin(0.5, 0);

//   this.title = graphics.add.text(this.x, this.y, this.name, {fill:'#fff', font:'16px Arial' });
//   this.title.setOrigin(0.5, 1);
// }

Agent.prototype.move = function(x, y, on_complete=function(){}, param0=null, duration=-1) {
  if (duration < 0) {
    duration = Agent.move_speed * Math.sqrt(Math.pow(x-this.x, 2)+Math.pow(y-this.y, 2));
  }

  graphics.tweens.add({targets:[this.sprite, this.title], x:x, y:y,
    duration:duration,
    onComplete:function(){on_complete(param0)}});
}

Agent.prototype.destroy = function() {
  this.sprite.destroy();
  this.title.destroy();
}

Agent.prototype.set_location = function(x, y) {
  console.log("set location " + x + " " + y);
  this.sprite.x = x;
  this.sprite.y = y;
  this.title.x = x;
  this.title.y = y;
}

Agent.prototype.add_trade = function(trade) {
  Agent.my_agent.trades[trade.trade_id] = trade;
  updateTradeRequest(trade.trade_id, trade.agent.agent_id, false);
}

Agent.prototype.remove_trade = function(trade_id) {
  Agent.my_agent.trades[trade_id].destroy();
}
