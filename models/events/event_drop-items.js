server.models.Event_dropItems = {};

server.models.Event_dropItems.event_name = "drop-items";

server.models.Event_dropItems.formats = [{
    "item_ids": "object",
  }];

server.models.Event_dropItems.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_dropItems.formats, structure);
};
