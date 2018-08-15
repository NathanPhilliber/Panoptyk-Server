
move_speed = 2.5;

function Agent(id, username, myAgent=false) {
  this.agent_id = id;
  this.name = username;
  this.x = Math.random() * (game.canvas.width-150) + 75;
  this.y = Math.random() * (game.canvas.height-150) + 75;
  this.graphics = graphics.add.graphics(0,0);

  console.log("Agent Initialized (" + id + ", " + username + ")");

  this.draw(myAgent);
  if (myAgent) {
    Agent.my_agent = this;
  }
}

Agent.prototype.draw = function(myAgent) {
  this.sprite = graphics.add.sprite(this.x, this.y, myAgent ? 'agent' : 'agent_other');
  this.sprite.setOrigin(0.5, 0);

  this.title = graphics.add.text(this.x, this.y, this.name, {fill:'#fff', font:'16px Arial' });
  this.title.setOrigin(0.5, 1);
}

Agent.prototype.move = function(x, y, on_complete, params) {
  graphics.tweens.add({targets:[this.sprite, this.title], x:x, y:y,
    duration:move_speed * Math.sqrt(Math.pow(x-this.x, 2)+Math.pow(y-this.y, 2)),
    onComplete:function(){on_complete(params)}});


//  (this.sprite).to({x:x, y:y}, 1000, Phaser.Easing.Linear.None, true);
}

Agent.prototype.destroy = function() {
  this.sprite.destroy();
  this.title.destroy();
}
