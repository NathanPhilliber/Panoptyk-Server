server.logger = {};
server.logger.logLevel = 2;
server.logger.lineLength = 100;
server.logger.logLevelNames = ['ERROR', 'WARNING', 'INFO'];

server.log = function(msg, logLevel=0) {
  if (logLevel <= server.logger.logLevel){
    var prefix = '[' + (new Date()).toISOString()
      .replace(/T/, ' ').replace(/\..+/, '') + "]═["
      + server.logger.logLevelNames[logLevel] + "]══";

    msg = prefix + (prefix.length + msg.length > server.logger.lineLength ? '╦═╡ ':'══╡ ') + msg;

    msg = msg.replace(new RegExp('(.{'+server.logger.lineLength+'})', 'g'),
      '$1\n                              ╠══╡ ');

    var index = msg.lastIndexOf("╠");
    if (index > 0) {
      msg = msg.substr(0, index) + "╚" + msg.substr(index + 1);
    }

    console.log(msg);
  }
}
