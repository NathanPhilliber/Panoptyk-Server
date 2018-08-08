function Event_moveToRoom(socket, inputData) {
  this.time = new Date();
  this.agent = server.models.Agent.get_agent_by_socket(socket);

  if (!(res = server.models.Event_moveToRoom.validate(inputData, this.agent)).status) {
    server.log('Bad event moveToRoom data.', 1);
    server.send.event_failed(socket, server.models.Event_moveToRoom.event_name, res.message);
    return false;
  }

  this.old_room = this.agent.room;
  this.new_room = server.models.Room.get_room_by_id(inputData.room_id);

  this.agent.move_to_room(this.new_room);

  (server.models.Event.objects = server.models.Event.objects || []).push(this);
  server.log('Event move-to-room (' + this.old_room.name + '->'
      + this.new_room.name  + ') for agent ' + this.agent.name + ' registered.', 2);
}


Event_moveToRoom.event_name = 'move-to-room';

Event_moveToRoom.formats = [{
  'room_id': 'number'
}]

Event_moveToRoom.validate = function(structure, agent) {

  if (!(res = server.models.Event.validate_key_format(server.models.Event_moveToRoom.formats, structure)).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_room_adjacent(agent.room, server.models.Room.get_room_by_id(structure.room_id))).status) {
    return res;
  }
  return res;
};

server.models.Event_moveToRoom = Event_moveToRoom;
