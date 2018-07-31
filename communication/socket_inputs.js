server.modules.io.on('connection', function(socket) {
  server.log('Client Connected');

  for (var event_index in server.models) {
    (function() {
      var event_key = event_index
      socket.on(server.models[event_key].event_name, function(data) {
        socket.emit('validity', {
                    'status': server.models[event_key].validate(data),
                    'recieved': (new Date()).toISOString()}
        );
      });
    })();
  }

});
