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


/**
 * Make sure an item is not locked.
 * @param {[Object]} items - items to check.
 * @returns {Object} {status: boolean, message: string, items: [Object]}
 */
server.models.Event.validate_items_not_in_transaction = function(items) {
  for (let item of items) {
    if (item.in_transaction) {
      return {'status': false, 'message': 'Item is currently in transaction'}
    }
  }

  return {status:true, message:'', items:items};
}


/**
 * Make sure a list of items is in a trade.
 * @param {[Object]} items - list of items to check.
 * @param {Object} trade - trade object.
 * @param {Object} owner - agent object.
 * @returns {Object} {status: boolean, message: string, trade: [Object]}
 */
server.models.Event.validate_items_in_trade = function(items, trade, owner) {
  if (owner == trade.agent_ini) {
    for (let item of items) {
      if (trade.items_ini.indexOf(item) < 0) {
        return {'status': false, 'message': 'Item not in trade'}
      }
    }
  }
  else if(owner == trade.agent_res) {
    for (let item of items) {
      if (trade.items_res.indexOf(item) < 0) {
        return {'status': false, 'message': 'Item not in trade'}
      }
    }
  }
  else {
    return {'status': false, 'message': 'Bad trade'}
  }

  return {status:true, message:'', trade:trade, items:items};
}


/**
 * Check if a trade has an agent ready status.
 * @param {Object} trade - trade object.
 * @param {Object} agent - agent object.
 * @param {boolean} rstatus - ready status.
 * @returns {Object} {status: boolean, message: string, trade: Object}
 */
server.models.Event.validate_ready_status = function(trade, agent, rstatus) {
  if (agent == trade.agent_ini) {
    if (trade.status_ini != rstatus) {
      return {status:false, message:'Trade ready status already set'}
    }
  }
  else if(agent == trade.agent_res) {
    if (trade.status_res != rstatus) {
      return {status:false, message:'Trade ready status already set'}
    }
  }
  else{
    return {status:false, message:'Agent not in trade'}
  }

  return {status:true, message:'', trade:trade};
}


/**
 * Check if a cnode is in given room.
 * @param {Object} room - room to see if cnode is in.
 * @param {Object} cnode - cnode object.
 * @returns {Object} {status: boolean, message: string, cnode: Object}
 */
server.models.Event.validate_cnode_exists = function(room, cnode) {
  if (cnode == null) {
    return {'status': false, 'message': 'Cnode does not exist'};
  }
  if (cnode.room !== room) {
    return {'status': false, 'message': 'Cnode not in agents room'};
  }

  return {status:true, message:'', cnode:cnode}
}


/**
 * Check if a cnode has space for another agent.
 * @param {Object} cnode - cnode object.
 * @returns {Object} {status: boolean, message: string, cnode: Object}
 */
server.models.Event.validate_cnode_has_space = function(cnode) {
  if (cnode.agents.length >= cnode.max_agents) {
    return {status: false, message: 'Cnode is full', cnode:cnode}
  }

  return {status: true, message:'', cnode:cnode};
}


/**
 * Check if an agent is in a cnode.
 * @param {Object} cnode - cnode object.
 * @param {Object} agent - agent object.
 * @returns {Object} {status: boolean, message: string, cnode: Object}
 */
server.models.Event.validate_cnode_has_agent = function(cnode, agent) {
  if (cnode.get_agent_by_id(agent.agent_id) == null) {
    return {status: false, message: 'Agent does not belong to cnode', cnode:cnode}
  }

  return {status: true, message: '', cnode: cnode};
}


/**
 * Check if two agents are in the same cnode.
 * @param {Object} agent1 - agent object.
 * @param {Object} agent2 - agent object.
 * @returns {Object} {status: boolean, message: string, cnode: Object, to_agent: Object}
 */
server.models.Event.validate_agents_share_cnode = function(agent1, agent2) {
  if (agent1.cnode != agent2.cnode || !agent1.cnode) {
    return {status:false, message: 'Agents not in same cnode'}
  }

  return {status: true, message:'', cnode:agent1.cnode, to_agent:agent2};
}


/**
 * Check if two agents are already engaged in a trade together.
 * @param {Object} agent1 - agent object.
 * @param {Object} agent2 - agent object.
 * @returns {Object} {}
 */
server.models.Event.validate_agents_not_already_trading = function(agent1, agent2) {

}


/**
 * Check if a trade exists.
 * @param {int} trade_id - id of trade.
 * @returns {Object} {status: boolean, message: string, trade: Object}
 */
server.models.Event.validate_trade_exists = function(trade_id) {
  var trade = server.models.Trade.get_trade_by_id(trade_id);

  if (!trade) {
    return {status: false, message: 'Could not find trade with id ' + trade_id}
  }

  return {status: true, message: '', trade:trade};
}


/**
 * Check if a trade has a given status.
 * @param {Object} trade - trade object.
 * @param {[int]} status_options - array of possible statuses.
 * @returns {Object} {status: boolean, message: string, trade: Object}
 */
server.models.Event.validate_trade_status = function(trade, status_options) {
  if (!trade || status_options.indexOf(trade.result_status) == -1) {
    return {status: false, message: 'Trade not in correct state', trade:trade}
  }

  return {status: true, message:'', trade:trade}
}


/**
 * Check that all items are physical.
 * @param {[Object]} items - array of items.
 * @returns {Object} {status: boolean, message: string, items: [Object]}
 */
server.models.Event.validate_items_are_physical = function(items) {
  for (let item of items) {
    if (!item.physical) {
      return {status: false, message: 'Item is not physiacl', items:items};
    }
  }

  return {status:true, message:'', items:items};
}

