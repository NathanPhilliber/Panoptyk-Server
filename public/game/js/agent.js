
function Agent(id, username, myAgent=false) {
  this.agent_id = id;
  this.name = username;
  this.x = Math.random() * (game.canvas.width-150) + 75;
  this.y = Math.random() * (game.canvas.height-150) + 75;
  this.graphics = graphics.add.graphics(0,0);
  this.sprite = graphics.add.sprite(this.x, this.y, myAgent ? 'agent' : 'agent_other');
  this.sprite.setOrigin(0.5, 0);
  console.log("Agent Initialized (" + id + ", " + username + ")");
  this.draw();
}

Agent.prototype.draw = function() {
  this.title = graphics.add.text(this.x, this.y, this.name, {fill:'#fff', font:'16px Arial' });
  this.title.setOrigin(0.5, 1);
}

Agent.prototype.move = function(x, y) {

}

Agent.prototype.destroy = function() {
  this.sprite.destroy();
  this.title.destroy();
}
