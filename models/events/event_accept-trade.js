server.models.Event_acceptTrade = {};

server.models.Event_acceptTrade.event_name = "accept-trade";

server.models.Event_acceptTrade.formats = [{
    "trade_id": "number"
  }];

server.models.Event_acceptTrade.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_acceptTrade.formats, structure);
};
