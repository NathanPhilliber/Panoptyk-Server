server.models.Event_offerItemsTrade = {};

server.models.Event_offerItemsTrade.event_name = "offer-items-trade";

server.models.Event_offerItemsTrade.formats = [{
    "trade_id": "number",
    "item_ids": "object"
  }];

server.models.Event_offerItemsTrade.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_offerItemsTrade.formats, structure);
};
