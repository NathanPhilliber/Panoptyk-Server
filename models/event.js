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

    return {'status': true, 'message': ''};
  }

  return {'status': false, 'message': 'Invalid or missing key'};
}


server.models.Event.validate_room_adjacent = function(old_room, new_room) {
  if (old_room.adjacents.indexOf(new_room) !== -1) {
    return {'status': true, 'message': ''};
  }

  return {'status': false, 'message': 'Invalid room movement'};
}


server.models.Event.validate_array_types = function(arr, atype) {
  for (let item of arr) {
    if (typeof item !== atype) {
      return {'status': false, 'message': 'Invalid type in array (' + typeof item + ')'};
    }
  }

  return {'status': true, 'message': ''};
}

server.models.Event.validate_agent_owns_items = function(agent, item_ids) {
  var items = Item.get_items_by_ids(item_ids);
  if (items === null) {
    return {'status': false, 'message': 'No item for id ' + id};
  }

  for (let item of items) {
    if (agent.inventory.indexOf(item) == -1) {
      return {'status': false, 'message': 'Agent does not have item ' + item.name};
    }
  }

  return {'status': true, 'message': '', 'items': items};
}
