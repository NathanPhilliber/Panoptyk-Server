
var cur_agent_color = 0xFF3300;
var other_agent_color = 0xFFFC6B;

function Agent(id, username, myAgent=false) {
  this.agent_id = id;
  this.name = username;
  this.x = Math.random() * game.canvas.width;
  this.y = Math.random() * game.canvas.height;
  this.graphics = graphics.add.graphics(0,0);
  this.color = myAgent ? cur_agent_color : other_agent_color;
  console.log("Agent Initialized (" + id + ", " + username + ")");
  this.draw();
}

Agent.prototype.draw = function() {
  this.graphics.fillStyle(this.color, 1);
  this.graphics.fillRect(this.x, this.y, 25, 25);
  var title = graphics.add.text(this.x, this.y, this.name, {fill:'#fff', font:'16px Arial' });
  title.setOrigin(0, 1);
}

Agent.prototype.move = function(x, y) {

}
