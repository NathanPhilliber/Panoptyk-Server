/**
 * Event model.
 * @param {Object} socket - socket.io client socket object.
 * @param {Object} inputData - raw input recieved.
 */
function Event_leaveCnode(socket, inputData) {
  this.time = new Date();
  this.agent = server.models.Agent.get_agent_by_socket(socket);

  if (!(res = server.models.Event_leaveCnode.validate(inputData, this.agent)).status) {
    server.log('Bad event leaveCnode data ('+JSON.stringify(inputData) + ').', 1);
    server.send.event_failed(socket, server.models.Event_leaveCnode.event_name, res.message);
    return false;
  }

  this.cnode = res.cnode;

  server.control.remove_agent_from_cnode(this.cnode, this.agent);

  (server.models.Validate.objects = server.models.Validate.objects || []).push(this);
  server.log('Event leave-cnode (' + this.cnode.cnode_id + ') for agent ' + this.agent.name + ' registered.', 2);
}

Event_leaveCnode.event_name = 'leave-cnode';

Event_leaveCnode.formats = [{
  'cnode_id': 'number'
}]


/**
 * Event validation.
 * @param {Object} structure - raw input recieved.
 * @param {Object} agent - agent associated with this event.
 * @return {Object}
 */
Event_leaveCnode.validate = function(structure, agent) {

  if (!(res = server.models.Validate.validate_agent_logged_in(agent)).status) {
    return res;
  }
  if (!(res = server.models.Validate.validate_key_format(server.models.Event_leaveCnode.formats, structure)).status) {
    return res;
  }
  if (!(res = server.models.Validate.validate_cnode_exists(agent.room, server.models.Cnode.get_cnode_by_id(structure.cnode_id))).status) {
    return res;
  }
  if (!(res = server.models.Validate.validate_cnode_has_agent(res.cnode, agent)).status) {
    return res;
  }
  return res;
};

server.models.Event_leaveCnode = Event_leaveCnode;
