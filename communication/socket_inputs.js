server.modules.io.on('connection', function(socket) {
  server.logger.log('Client Connected');

  socket.on('test', function(data) {
    server.logger.log('Test message received');
    data.timeReceived = (new Date()).toISOString();
    socket.emit('Message Received', data);
  });

});
