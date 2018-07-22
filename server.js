server = {};

server.modules = {};
server.modules.express = require('express');
server.modules.app = server.modules.express();
server.modules.server = require('http').Server(server.modules.app);
server.modules.io = require('socket.io').listen(server.modules.server);

require(__dirname + '/utilities/logger.js');
require(__dirname + '/communication/socket_inputs.js');


server.modules.app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/test.html');
});

server.modules.server.listen(process.env.PORT || 80, function() {
  server.logger.log('Starting server on port ' + server.modules.server.address().port);
});
