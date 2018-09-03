/**
 * Event model.
 * @param {Object} socket - socket.io client socket object.
 * @param {Object} inputData - raw input recieved.
 */
function Event_joinCnode(socket, inputData) {
  this.time = new Date();
  this.agent = server.models.Agent.get_agent_by_socket(socket);

  if (!(res = server.models.Event_joinCnode.validate(inputData, this.agent)).status) {
    server.log('Bad event joinCnode data ('+JSON.stringify(inputData) + ').', 1);
    server.send.event_failed(socket, server.models.Event_joinCnode.event_name, res.message);
    return false;
  }

  this.cnode = res.cnode;

  server.control.add_agent_to_cnode(this.cnode, this.agent);

  (server.models.Event.objects = server.models.Event.objects || []).push(this);
  server.log('Event join-cnode (' + this.cnode.cnode_id + ') for agent ' + this.agent.name + ' registered.', 2);
}

Event_joinCnode.event_name = 'join-cnode';

Event_joinCnode.formats = [{
  'cnode_id': 'number'
}]


/**
 * Event validation.
 * @param {Object} structure - raw input recieved.
 * @param {Object} agent - agent associated with this event.
 * @return {Object}
 */
Event_joinCnode.validate = function(structure, agent) {

  if (!(res = server.models.Event.validate_agent_logged_in(agent)).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_key_format(server.models.Event_joinCnode.formats, structure)).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_cnode_exists(agent.room, server.models.Cnode.get_cnode_by_id(structure.cnode_id))).status) {
    return res;
  }
  if (!(res = server.models.Event.validate_cnode_has_space(res.cnode)).status) {
    return res;
  }
  return res;
};

server.models.Event_joinCnode = Event_joinCnode;
