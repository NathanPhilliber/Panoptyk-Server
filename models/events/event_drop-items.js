server.models.Event_dropItems = {};

server.models.Event_dropItems.event_name = 'drop-items';

server.models.Event_dropItems.formats = [{
    'item_ids': 'object',
  }];

server.models.Event_dropItems.validate = function(structure, agent) {
  if (!(res = server.models.Event.validate_key_format(server.models.Event_dropItems.formats, structure)).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_array_types(structure.item_ids, 'number')).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_agent_owns_items(agent, structure.item_ids)).status) {
    return res; // Make sure this one is last ^^
  }
  return res;
};

function Event_dropItems(socket, inputData) {
  this.time = new Date();
  this.agent = Agent.get_agent_by_socket(socket);

  if (!(res = server.models.Event_dropItems.validate(inputData, agent)).status) {
    server.log('Bad event dropItems data.', 1);
    server.send.event_failed(socket, server.models.Event_dropItems.event_name, res.message);
    return false;
  }

  this.items = res.items;
  this.room = agent.room;

  (server.models.Event.objects = server.models.Event || []).push(this);
  server.log('Event drop-items (' + JSON.stringify(inputData.item_ids) + ') for agent '
      + this.agent.name + ' registered.', 2);
}
