var format = require(__dirname + "/events_register.json");

// Will need to pass in socket or agent object as well to check authetification
exports.check_keys = function (event_name, event_data) {
  if (event_name in format) {

  }
}
