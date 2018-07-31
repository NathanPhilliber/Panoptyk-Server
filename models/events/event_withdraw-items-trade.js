server.models.Event_withdrawItemsTrade = {};

server.models.Event_withdrawItemsTrade.event_name = "withdraw-items-trade";

server.models.Event_withdrawItemsTrade.formats = [{
    "trade_id": "number",
    "item_ids": "object"
  }];

server.models.Event_withdrawItemsTrade.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_withdrawItemsTrade.formats, structure);
};
