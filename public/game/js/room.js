
function Room(room_id, room_name, adjacents, layout, agents, items) {
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
    this.adjacents.push(new ExitNode(room_data.room_id, room_data.room_name, xpos));
    xpos += 150;
  }

  this.items = []
  for (let item of items) {
    this.items.push(new Item(item.item_id, item.item_name, item.item_type));
  }

  graphics.add.text(10, 10, this.name, { fill: '#fff', font:'32px Arial' });
}

function ExitNode(room_id, room_name, xpos) {
  this.room_id = room_id;
  this.name = room_name;
  this.graphics = graphics.add.graphics(0,0);
  this.graphics.fillStyle(0x00FF33, 1);
  this.graphics.fillRect(xpos, game.canvas.height-30, 50, 30);
  var title = graphics.add.text(xpos, game.canvas.height-33, room_name, {fill:'#fff', font:'16px Arial'});
  title.setOrigin(0,1);
}


