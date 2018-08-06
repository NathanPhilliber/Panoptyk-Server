server.models.Event_login = {};

server.models.Event_login.event_name = "login";

server.models.Event_login.formats = [{
    "username": "string",
    "password": "string"
  },
  {
    "token": "string"
  }];

server.models.Event_login.validate = function(structure) {
  return server.models.Event.validate_key_format(server.models.Event_login.formats, structure);
};

server.models.Event_login.on_success = function() {

}

server.models.Event_login.on_failure = function() {

}
