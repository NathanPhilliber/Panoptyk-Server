var parser = require(__dirname + '/input_parser.js');

server.modules.io.on('connection', function(socket) {
  server.logger.log('Client Connected');

  socket.on('test', function(data) {
    parser.check_keys('test', data);
    server.logger.log('Test message received');
    data.timeReceived = (new Date()).toISOString();
    socket.emit('Message Received', data);
  });

  socket.on('login', function(data) {
    agent = new server.models.Agent(socket, data.username);


    socket.emit('Validity', {"status": server.models.Event_login.validate(data)});

  });


  socket.on('move-to-room', function(data) {
    socket.emit('Validity', {"status": server.models.Event_moveToRoom.validate(data)});
  });

});
