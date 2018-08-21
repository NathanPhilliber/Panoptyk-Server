server.directory = {};

server.directory.make = function(dir) {
  if (!server.modules.fs.existsSync(dir)) {
    server.modules.fs.mkdirSync(dir);
  }
}
