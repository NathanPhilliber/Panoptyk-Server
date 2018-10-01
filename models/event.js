server.models.Event = {};

success_msg = {'status': true, 'message': ''};

/**
 * Validate a given dictionary has same keys as one of theprovided ones.
 * @param {[Object]} goodFormats - given formats to match to.
 * @param {Object} inputFormat - dictionary being inspected.
 * @return {Object} {status: boolean, message: string}
 */
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

    return success_msg;
  }

  return {'status': false, 'message': 'Invalid or missing key'};
}


/**
 * Validate one room is adjacent to another.
 * @param {Object} old_room - starting room.
 * @param {Object} new_room - target room.
 * @return {Object} {status: boolean, message: string}
 */
server.models.Event.validate_room_adjacent = function(old_room, new_room) {
  if (old_room.adjacents.indexOf(new_room) !== -1) {
    return success_msg;
  }

  return {'status': false, 'message': 'Invalid room movement'};
}


/**
 * Validate a list contains all of one type.
 * @param {Object} arr - list
 * @param {string} atype - type
 * @return {Object} {status: boolean, message: string}
 */
server.models.Event.validate_array_types = function(arr, atype) {
  for (let item of arr) {
    if (typeof item !== atype) {
      return {'status': false, 'message': 'Invalid type in array (' + typeof item + ')'};
    }
  }

  return success_msg;
}


/**
 * Validate agent owns list of items.
 * @param {Object} agent - agent that might own items.
 * @param {[int]} item_ids - ids of items agent is supposed to own.
 * @return {Object} {status: boolean, message: string, items:[Object]}
 */
server.models.Event.validate_agent_owns_items = function(agent, item_ids) {
  var items = server.models.Item.get_items_by_ids(item_ids);
  if (items === null) {
    return {'status': false, 'message': 'No item for id ' + JSON.stringify(item_ids)};
  }

  for (let item of items) {
    if (agent.inventory.indexOf(item) == -1) {
      return {'status': false, 'message': 'Agent does not have item ' + item.name};
    }
  }

  return {status:true, message:'', items:items};
}


/**
 * Validate that an agent is logged in.
 * @param {Object} agent - agent object.
 * @return {Object} {status: boolean, message: string}
 */
server.models.Event.validate_agent_logged_in = function(agent) {
  if (agent !== null) {
    return success_msg;
  }

  return {'status': false, 'message': 'Agent not logged in'};
}


/**
 * Validate items are in room.
 * @param {Object} room - room items are supposed to be in.
 * @param {[int]} item_ids - ids of items room is supposed to have.
 * @return {Object} {status: boolean, message: string, items:[Object]}
 */
server.models.Event.validate_items_in_room = function(room, item_ids) {
  var items = server.models.Item.get_items_by_ids(item_ids);
  if (items === null) {
    return {'status': false, 'message': 'No item for id ' + JSON.stringify(item_ids)};
  }

  for (let item of items) {
    if (item.room !== room) {
      return {'status': false, 'message': 'Item not in room ' + room.name};
    }
  }

  return {status:true, message:'', items:items};
}


server.models.Event.validate_cnode_exists = function(room, cnode) {
  if (cnode == null) {
    return {'status': false, 'message': 'Cnode does not exist'};
  }
  if (cnode.room !== room) {
    return {'status': false, 'message': 'Cnode not in agents room'};
  }

  return {status:true, message:'', cnode:cnode}
}


server.models.Event.validate_cnode_has_space = function(cnode) {
  if (cnode.agents.length >= cnode.max_agents) {
    return {status: false, message: 'Cnode is full', cnode:cnode}
  }

  return {status: true, message:'', cnode:cnode}
}


server.models.Event.validate_cnode_has_agent = function(cnode, agent) {
  if (cnode.get_agent_by_id(agent.agent_id) == null) {
    return {status: false, message: 'Agent does not belong to cnode', cnode:cnode}
  }

  return {status: true, message: '', cnode: cnode}
}

server.models.Event.validate_trade_exists = function(trade_id) {
  var trade = server.models.Trade.get_trade_by_id(trade_id);

  if (!trade) {
    return {status: false, message: 'Could not find trade with id ' + trade_id}
  }

  return {status: true, message: '', trade:trade}
}

server.models.Event.validate_trade_status = function(trade, status_options) {
  if (status_options.indexOf(trade.result_status) == -1) {
    return {status: false, message: 'Trade not in correct state', trade:trade}
  }

  return {status: true, message:'', trade:trade}
}

