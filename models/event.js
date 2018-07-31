server.models.Event = {};

// Check if provided data is same format as one of Event_X.formats
// No extra keys allowed
server.models.Event.validate_key_format = function(goodFormats, inputFormat) {

  formatLoop:
  for (let format of goodFormats) {

    if (Object.keys(format).length != Object.keys(inputFormat).length)
      break formatLoop;

    for (var eventName in inputFormat) {
      if (!(eventName in format)) {
        break formatLoop;
      }
    }

    for (var eventName in format) {
      if (!(eventName in inputFormat && typeof inputFormat[eventName] == format[eventName])) {
        break formatLoop;
      }
    }

    return true;
  }

  return false;
}

