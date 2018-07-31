server.models.Event_cancelTrade = {};

server.models.Event_cancelTrade.event_name = "cancel-trade";

server.models.Event_cancelTrade.formats = [{
    "trade_id": "number"
  }];

server.models.Event_cancelTrade.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_cancelTrade.formats, structure);
};
