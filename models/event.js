server.models.Event = {};

server.models.Event.validate = function(goodFormats, inputFormat) {


  for (let format of goodFormats) {

    var isValid = true;
    for (var eventName in inputFormat) {
      if (!(eventName in format)) {
        isValid = false;
        break;
      }
    }

    for (var eventName in format) {
      if (!(eventName in inputFormat && typeof inputFormat[eventName] == format[eventName])) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      return true;
    }
  }

  return false;
}

