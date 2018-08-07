server.models.Event_moveToRoom = {};

server.models.Event_moveToRoom.event_name = "move-to-room";

server.models.Event_moveToRoom.formats = [{
  "room_id": "number"
}]

server.models.Event_moveToRoom.validate = function(structure, old_room, new_room) {

  if (!(res = server.models.Event.validate_key_format(server.models.Event_moveToRoom.formats, structure)).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_room_adjacent(old_room, new_room)).status) {
    return res;
  }
  return res;
};

function Event_moveToRoom(socket, inputData) {
  this.time = new Date();
  this.agent = Agent.get_agent_by_socket(socket);

  if (!(res = server.models.Event_moveToRoom.validate(inputData, agent.room, Room.get_room_by_id(inputData.room_id))).status) {
    server.log("Bad event moveToRoom data.", 1);
    server.send.event_failed(socket, server.models.Event_moveToRoom.event_name, res.message);
    return false;
  }

  this.old_room = this.agent.room;
  this.new_room = Room.get_room_by_id(inputData.room_id);

  this.agent.move_to_room(this.new_room);

  (server.models.Event.objects = Server.models.Event || []).push(this);
  server.log("Event move-to-room (" + this.old_room.name + "->"
      + this.new_room.name  + ") for agent " + this.agent.name + " registered.", 2);
}
