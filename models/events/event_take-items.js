function Event_takeItems(socket, inputData) {
  this.time = new Date();
  this.agent = server.models.Agent.get_agent_by_socket(socket);

  if (!(res = server.models.Event_takeItems.validate(inputData, this.agent)).status) {
    server.log("Bad event takeItems data ("+JSON.stringify(inputData) + ').', 1);
    server.send.event_failed(socket, server.models.Event_takeItems.event_name, res.message);
    return false;
  }


}

Event_takeItems.event_name = "take-items";

Event_takeItems.formats = [{
    "item_ids": "object"
  }];

Event_takeItems.validate = function(structure, agent) {
  if (!(res = server.models.Event.validate_agent_logged_in(agent)).status) {
    return res;
  }

  if (!(res = server.models.Event.validate_key_format(server.models.Event_takeItems.formats, structure)).status) {
    return res;
  }

  return server.models.Event.validate_key_format(server.models.Event_takeItems.formats, structure);
};

server.models.Event_takeItems = Event_takeItems;
