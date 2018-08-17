current_room = -1;

function Room(room_id, room_name, adjacents, layout, agents, items, old_room_id) {

  if (current_room !== -1) {
    current_room.destroy();
  }

  graphics.cameras.main.setBackgroundColor(
    '#'+(parseFloat('.' + ((room_id+1)*(room_id+1)*1127))*0xFFFFFF<<0).toString(16));

  this.room_id = room_id;
  this.name = room_name;
  this.layout = layout;

  var xpos = 50;
  this.adjacents = [];
  for (let room_data of adjacents) {
    this.adjacents.push(new ExitNode(room_data.room_id, room_data.room_name, xpos));

    xpos += 150;
  }

  this.place_agent(old_room_id, Agent.my_agent);

  Agent.my_agent.move(
    Math.random() * (game.canvas.width-150) + 75,
    Math.random() * (game.canvas.height-150) + 75, function(){}, null);

  this.items = []
  for (let item of items) {
    this.items.push(new Item(item.item_id, item.item_name, item.item_type));
  }

  this.agents = [];
  for (let agent of agents) {
    this.agents.push(new Agent(agent.agent_id, agent.agent_name));
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

Room.prototype.place_agent = function(old_room_id, agent) {
  (this.agents = this.agents || []).push(agent);
  for (let exit of this.adjacents) {
    if (exit.room_id == old_room_id) {
      agent.set_location(exit.sprite.x, exit.sprite.y);
      break;
    }
  }
}

Room.prototype.remove_agent = function(agent_id, room_id) {
  console.log("Removing agent id=" + agent_id + " to room=" + room_id);
  console.log(this.agents.length);
  for (let agent of this.agents) {
    console.log(agent.agent_id + " ?= " + agent_id);
    if (agent.agent_id == agent_id) {
      for (let exit of this.adjacents) {
        if (exit.room_id == room_id) {
          console.log("Found agent and exit");
          agent.move(exit.sprite.x, exit.sprite.y, function(agent) {
            agent.destroy();
          }, agent);
          return;
        }
      }
    }
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


