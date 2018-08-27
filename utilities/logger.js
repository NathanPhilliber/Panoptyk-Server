server.logger = {};
server.logger.logLevelNames = ['ERROR', 'WARNING', 'INFO'];

server.log = function(msg, logLevel=0) {
  if (logLevel <= server.settings.log_level){
    var prefix = '[' + (new Date()).toISOString()
      .replace(/T/, ' ').replace(/\..+/, '') + "]═["
      + server.logger.logLevelNames[logLevel] + "]══";

    msg = prefix + (prefix.length + msg.length > server.settings.log_line_lengh ?
      '╦═╡ ':'══╡ ') + msg;

    msg = msg.replace(new RegExp('(.{'+server.settings.log_line_length+'})', 'g'),
      '$1\n                              ╠══╡ ');

    var index = msg.lastIndexOf("╠");
    if (index > 0) {
      msg = msg.substr(0, index) + "╚" + msg.substr(index + 1);
    }

    console.log(msg);
  }
}
