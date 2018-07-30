server.models.Event_moveToRoom = {};

server.models.Event_moveToRoom.event_name = "move-to-room";

server.models.Event_moveToRoom.formats = [{
  "room_id": "number"
}]

server.models.Event_moveToRoom.validate = function(structure) {
  return server.models.Event.validate(server.models.Event_moveToRoom.formats, structure);
};
