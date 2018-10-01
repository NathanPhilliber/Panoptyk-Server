/**
 * Event model.
 * @param {Object} socket - socket.io client socket object.
 * @param {Object} inputData - raw input recieved.
 */
function Event_cancelTrade(socket, inputData) {
  this.time = new Date();
  this.from_agent = server.models.Agent.get_agent_by_socket(socket);

  if (!(res = server.models.Event_cancelTrade.validate(inputData, this.from_agent)).status) {
    server.log('Bad event cancelTrade data ('+JSON.stringify(inputData) + ').', 1);
    server.send.event_failed(socket, server.models.Event_cancelTrade.event_name, res.message);
    return false;
  }

  this.cnode = res.cnode;
  this.to_agent = res.to_agent;
  this.trade = res.trade;

  server.control.cancel_trade(this.trade);

  (server.models.Event.objects = server.models.Event.objects || []).push(this);
  server.log('Event cancel-trade (' + this.trade.trade_id + ') for agent ' + this.from_agent.name + '/' + this.to_agent.name + ' registered.', 2);
}

Event_cancelTrade.event_name = 'cancel-trade';

Event_cancelTrade.formats = [{
  'trade_id': 'number'
}]


/**
 * Event validation.
 * @param {Object} structure - raw input recieved.
 * @param {Object} agent - agent associated with this event.
 * @return {Object}
 */
Event_cancelTrade.validate = function(structure, agent) {

  if (!(res = server.models.Event.validate_agent_logged_in(agent)).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_key_format(server.models.Event_cancelTrade.formats, structure)).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_trade_exists(structure.trade_id)).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_trade_status(res.trade, [2, 3])).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_agent_logged_in(res.trade.agent_ini)).status) {
    return res;
  }

  return res;
};

server.models.Event_cancelTrade = Event_cancelTrade;
