function Event_login(socket, inputData) {
  this.time = new Date();

  if (!(res = server.models.Event_login.validate(inputData)).status) {
    server.log('Bad event login data.', 1);
    server.send.event_failed(socket, server.models.Event_login.event_name, res.message);
    return;
  }

  this.agent = server.models.Agent.login(inputData.username, socket);

  (server.models.Event.objects = server.models.Event.objects || []).push(this);
  server.log('Event login for agent ' + this.agent.name + ' registered.', 2);
}

//server.models.Event_login = {};

Event_login.event_name = 'login';

Event_login.formats = [{
  'username': 'string',
  'password': 'string'
},
{
  'username': 'string',
  'token': 'string'
}];

Event_login.validate = function(structure) {
  if (!(res = server.models.Event.validate_key_format(server.models.Event_login.formats, structure)).status) {
    return res;
  }
  return res;
};

server.models.Event_login = Event_login;