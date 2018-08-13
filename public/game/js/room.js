
function Room(room_id, room_name, adjacents, layout, agents, items) {
  this.room_id = room_id;
  this.name = room_name;
  this.adjacent_rooms = adjacents;
  this.layout = layout;

  this.agents = [];
  for (let agent of agents) {
    this.agents.push(new Agent(agent.agent_id, agent.agent_name));
  }

  this.items = items;

  graphics.add.text(10, 10, this.name, { fill: '#fff', font:'32px Arial' });
}
