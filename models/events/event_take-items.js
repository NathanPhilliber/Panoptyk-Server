server.models.Event_takeItems = {};

server.models.Event_takeItems.event_name = "take-items";

server.models.Event_takeItems.formats = [{
    "item_ids": "object"
  }];

server.models.Event_takeItems.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_takeItems.formats, structure);
};
