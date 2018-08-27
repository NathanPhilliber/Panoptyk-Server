server = {};

server.modules = {};
server.modules.express = require('express');
server.modules.app = server.modules.express();
server.modules.server = require('http').Server(server.modules.app);
server.modules.io = require('socket.io').listen(server.modules.server);
server.modules.fs = require('fs');

server.settings = require(__dirname + '/panoptyk-settings.json');

require(__dirname + '/utilities/logger.js');
require(__dirname + '/utilities/directory.js');
require(__dirname + '/communication/socket_inputs.js');
require(__dirname + '/communication/socket_outputs.js');

server.models = {};

server.models.Room = require(__dirname + '/models/room.js');
server.models.Agent = require(__dirname + '/models/agent.js');
server.models.Item = require(__dirname + '/models/item.js');
server.models.Trade = require(__dirname + '/models/trade.js');

require(__dirname + '/models/event.js');
server.modules.fs.readdirSync(__dirname + '/models/events/').forEach(function(file) {
  require(__dirname + '/models/events/' + file);
});

server.modules.app.use('/public/game', server.modules.express.static(__dirname + '/public/game'));

server.modules.app.get('/test', function(req, res) {
  res.sendFile(__dirname + '/public/test.html');
});

server.modules.app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/public/game/game.html');
});

server.modules.server.listen(process.env.PORT || server.settings.port, function() {
  server.log('Starting server on port ' + server.modules.server.address().port, 2);
});

process.on('SIGINT', () => {
  server.log("Shutting down", 2);

  server.models.Agent.save_all();
  server.models.Room.save_all();
  server.models.Item.save_all();

  server.log("Server closed", 2);
  process.exit(0);
});

server.directory.make(server.settings.data_dir);
server.directory.make(server.settings.data_dir + '/agents');
server.directory.make(server.settings.data_dir + '/rooms');
server.directory.make(server.settings.data_dir + '/items');

server.models.Room.load_all();
server.models.Agent.load_all();
server.models.Item.load_all();


/*
var room0 = new server.models.Room('Test_Room_0');
var room1 = new server.models.Room('Test_Room_1');
var room2 = new server.models.Room('Test_Room_2');
var room3 = new server.models.Room('Test_Room_3');
var room4 = new server.models.Room('Test_Room_4');

room0.connect_room(room1);
room0.connect_room(room2);
room2.connect_room(room3, false);
room2.connect_room(room4);
room3.connect_room(room1, false);
room1.connect_room(room4);

var item0 = new server.models.Item("Test_Item_0", "Type0");
var item1 = new server.models.Item("Test_Item_1", "Type0");
var item2 = new server.models.Item("Test_Item_2", "Type1");
var item3 = new server.models.Item("Test_Item_3", "Type1");
var item4 = new server.models.Item("Test_Item_4", "Type2");
var item5 = new server.models.Item("Test_Item_5", "Type2");
var item6 = new server.models.Item("Test_Item_6", "Type3");
var item7 = new server.models.Item("Test_Item_7", "Type3");

item0.put_in_room(room0);
item1.put_in_room(room0);
item2.put_in_room(room0);
item3.put_in_room(room1);
item4.put_in_room(room2);
item5.put_in_room(room3);
item6.put_in_room(room4);
item7.put_in_room(room4);
*/
