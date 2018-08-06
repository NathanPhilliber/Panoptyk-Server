server = {};

server.modules = {};
server.modules.express = require('express');
server.modules.app = server.modules.express();
server.modules.server = require('http').Server(server.modules.app);
server.modules.io = require('socket.io').listen(server.modules.server);
server.modules.fs = require('fs');

server.settings = require(__dirname + '/panoptyk-settings.json');

require(__dirname + '/utilities/logger.js');
require(__dirname + '/communication/socket_inputs.js');

server.models = {};

server.models.Agent = require(__dirname + '/models/agent.js');
server.models.Item = require(__dirname + '/models/item.js');
server.models.Room = require(__dirname + '/models/room.js');
server.models.Trade = require(__dirname + '/models/trade.js');

require(__dirname + '/models/event.js');
server.modules.fs.readdirSync(__dirname + '/models/events/').forEach(function(file) {
  require(__dirname + '/models/events/' + file);
});


server.modules.app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/test.html');
});

server.modules.server.listen(process.env.PORT || 80, function() {
  server.log('Starting server on port ' + server.modules.server.address().port);
});

