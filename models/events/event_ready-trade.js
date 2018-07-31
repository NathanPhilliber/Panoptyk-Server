server.models.Event_readyTrade = {};

server.models.Event_readyTrade.event_name = "ready-trade";

server.models.Event_readyTrade.formats = [{
    "trade_id": "number",
    "ready_status": "boolean"
  }];

server.models.Event_readyTrade.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_readyTrade.formats, structure);
};
