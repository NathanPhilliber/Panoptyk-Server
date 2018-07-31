server.logger = {};

server.log = function(msg) {
  console.log('[' + (new Date()).toISOString()
    .replace(/T/, ' ').replace(/\..+/, '') + "]    "  + msg);
}
