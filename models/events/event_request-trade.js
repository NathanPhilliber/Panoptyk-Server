server.models.Event_requestTrade = {};

server.models.Event_requestTrade.event_name = "request-trade";

server.models.Event_requestTrade.formats = [{
    "agent_id": "number"
  }];

server.models.Event_requestTrade.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_requestTrade.formats, structure);
};
