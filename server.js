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




// TEST DATA. DELETE THIS.

var room0 = new server.models.Room("Test_Room_0");
var room1 = new server.models.Room("Test_Room_1");
var room2 = new server.models.Room("Test_Room_2");
var room3 = new server.models.Room("Test_Room_3");
var room4 = new server.models.Room("Test_Room_4");

room0.connect_room(room1);
room0.connect_room(room2);
room2.connect_room(room3, false);
room2.connect_room(room4);
room3.connect_room(room1, false);
room1.connect_room(room4);
