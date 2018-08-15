current_room = -1;

function Room(room_id, room_name, adjacents, layout, agents, items) {

  if (current_room !== -1) {
    current_room.destroy();
  }

  this.room_id = room_id;
  this.name = room_name;
  this.layout = layout;

  this.agents = [];
  for (let agent of agents) {
    this.agents.push(new Agent(agent.agent_id, agent.agent_name));
  }

  var xpos = 50;
  this.adjacents = [];
  for (let room_data of adjacents) {
    console.log(JSON.stringify(room_data));
    this.adjacents.push(new ExitNode(room_data.room_id, room_data.room_name, xpos));
    xpos += 150;
  }

  this.items = []
  for (let item of items) {
    this.items.push(new Item(item.item_id, item.item_name, item.item_type));
  }

  this.title = graphics.add.text(10, 10, this.name, { fill: '#fff', font:'32px Arial' });

  current_room = this;
}

Room.prototype.destroy = function() {
  console.log("Destroy room");

  this.title.destroy();

  for (let agent of this.agents) {
    agent.destroy();
  }

  for (let item of this.items) {
    item.destroy();
  }

  for (let exit of this.adjacents) {
    exit.destroy();
  }
}

function ExitNode(room_id, room_name, xpos) {
  this.room_id = room_id;
  this.name = room_name;
  this.graphics = graphics.add.graphics(0,0);
  this.sprite = graphics.add.sprite(xpos, game.canvas.height-30, 'exit');
  this.sprite.setOrigin(0.5, 0);
  this.sprite.setInteractive();
  this.sprite.on('pointerdown', function(ev) {
    console.log("Moving to room " + room_id);
    Agent.my_agent.move(xpos, game.canvas.height-33, Client.send.moveToRoom, room_id);
  });
  this.title = graphics.add.text(xpos, game.canvas.height-33, room_name, {fill:'#fff', font:'16px Arial'});
  this.title.setOrigin(0.5,1);
}

ExitNode.prototype.destroy = function() {
  this.sprite.destroy();
  this.title.destroy();
}
