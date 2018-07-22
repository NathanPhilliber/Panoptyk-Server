server.logger = {};

server.logger.log = function(msg) {
  console.log('[' + (new Date()).toISOString()
    .replace(/T/, ' ').replace(/\..+/, '') + "]    "  + msg);
}
