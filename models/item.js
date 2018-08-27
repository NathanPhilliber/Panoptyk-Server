Item.objects = [];

/**
 * Item model.
 * @param {string} name - item name
 * @param {string} type - item type
 */
function Item(name, type, room=null, agent=null, id=null) {
  this.type = type;
  this.name = name;
  this.room = room;
  this.agent = agent;

  (Item.objects = Item.objects || []).push(this);
  this.item_id = id == null ? Item.objects.length - 1 : id;

  if (this.room !== null) {
    this.room.items.push(this);
  }

  if (this.agent !== null) {
    this.agent.inventory.push(this);
  }

  server.log('Item ' + this.type + ':' + this.name + ' Initialized.', 2);
}

Item.load = function(data) {
  new Item(data.name, data.type, server.models.Room.get_room_by_id(data.room_id),
    server.models.Agent.get_agent_by_id(data.agent_id), data.item_id);
}

Item.prototype.serialize = function() {
  var data = {
    name: this.name,
    type: this.type,
    room_id: this.room == null ? null : this.room.room_id,
    agent_id: this.agent == null ? null : this.agent.agent_id,
    item_id: this.item_id
  }

  return data;
}

Item.save_all = function() {
  server.log("Saving items...", 2);

  for (let item of Item.objects) {
    server.log("Saving item " + item.name, 2);

    server.modules.fs.writeFileSync(server.settings.data_dir + '/items/' + item.item_id + '_' + item.name + '.json',
      JSON.stringify(item.serialize()), 'utf8');
  }

  server.log("Items saved.", 2);
}

Item.load_all = function() {
  server.log("Loading items...", 2);

  server.modules.fs.readdirSync(server.settings.data_dir + '/items/').forEach(function(file) {
    server.modules.fs.readFile(server.settings.data_dir + '/items/' + file, function read(err, data) {
      if (err) {
        server.log(err);
        return;
      }

      var json = JSON.parse(data);
      server.log("Loading item " + json.name, 2);
      Item.load(json);
    });
  });
}

/**
 * Put item in room and send updates.
 * @param {Object} room - room object to put item in.
 */
Item.put_in_room = function(items, room) {

  server.log("Putting " + items.length + " items in room.", 2);

  for (let item of items) {
    item.room = room;
    room.add_item(item);
  }


  server.send.add_items_room(items, room);
}


/**
 * Remove item from its room and send updates.
 */
Item.remove_from_room = function(items, agent_id=null) {
  var cur_room = items[0].room;

  for (let item of items) {
    if (item.room !== cur_room) {
      server.log('Tried to take items from room, but not all items in same room.', 1);
      return false;
    }
    if (item.room === null) {
      server.log('Tried to take item ' + item.name + ' from room, but item does not have room.', 1);
      return false;
    }
  }

  server.send.remove_items_room(items, cur_room, agent_id);

  for (let item of items) {
    item.room.remove_item(item);
    item.room = null;

  }
}


/**
 * Give this item to an agent and send updates.
 * Does not modify agent object (Call from agent).
 * @param {Object} agent - agent object to give item to.
 */
Item.give_to_agent = function(items, agent) {
  for (let item of items) {
    item.agent = agent;
    agent.inventory.push(item);
  }

  server.send.add_items_inventory(agent, items);
}


/**
 * Take this item from an agent and send updates.
 * Does not modify agent object (Call from agent).
 */
Item.take_from_agent = function(items) {

  for (let item of items) {
    if (item.agent === null) {
      server.log('Tried to take item ' + item.name +
        ' from agent, but item does not have agent.', 0);

      return false;
    }
  }


  server.send.remove_items_inventory(items[0].agent, items);

  for (let item of items) {
    item.agent.remove_item_inventory(item);
    item.agent = null;
  }
}


/**
 * Get 'ready-to-send' data to send to client.
 * @returns {Object}
 */
Item.prototype.get_data = function() {
  return {
    'item_id': this.item_id,
    'item_type': this.type,
    'item_name': this.name
  }
}


Item.get_item_by_id = function(item_id) {
  for (let item of Item.objects) {
    if (item.item_id == item_id) {
      return item;
    }
  }

  server.log('Could not find item with id ' + item_id + '.', 0);
  return null;
}


Item.get_items_by_ids = function(item_ids) {
  var items = [];
  for (let id of item_ids) {
    items.push(Item.get_item_by_id(id));
    if (items[-1] === null) {
      server.log('Could not find item for id ' + id + '.', 0);
      return null;
    }
  }

  return items;
}

module.exports = Item;
