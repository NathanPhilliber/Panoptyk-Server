server.logger = {};
server.logger.logLevel = 2;

server.logger.logLevelNames = ['ERROR', 'WARNING', 'INFO'];

server.log = function(msg, logLevel=0) {
  if (logLevel <= server.logger.logLevel){
    console.log('[' + (new Date()).toISOString()
      .replace(/T/, ' ').replace(/\..+/, '') + "] [" + server.logger.logLevelNames[logLevel] + "]   "  + msg);
  }
}
