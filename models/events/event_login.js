server.models.Event_login = {};

server.models.Event_login.event_name = "login";

server.models.Event_login.formats = [{
    "username": "string",
    "password": "string"
  },
  {
    "username": "string",
    "token": "string"
  }];

server.models.Event_login.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_login.formats, structure);
};

function Event_login(socket, inputData) {
    this.time = new Date();

    if (!(res = server.models.Event_login.validate(inputData)).status) {
        Server.log("Bad event login data.", 1);
        server.send.event_failed(socket, server.models.Event_login.event_name, res.message);
        return;
    }

    this.agent = new server.models.Agent(socket, inputData.username);

    (server.models.Event.objects = Server.models.Event || []).push(this);
    server.log("Event login for agent " + this.agent.name + " registered.", 2);
}
