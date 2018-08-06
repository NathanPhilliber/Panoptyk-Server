/**
 * Item model.
 * @param {string} name - item name
 * @param {string} type - item type
 */
function Item(name, type) {
    this.item_id = null;
    this.type = type;
    this.name = name;
    this.room = null;
    this.agent = null;
}


/**
 * Put item in room and send updates.
 * @param {Object} room - room object to put item in.
 */
Item.prototype.put_in_room = function(room) {
    this.room = room;

    server.send.add_items_room([this], room);
}


/**
 * Remove item from its room and send updates.
 */
Item.prototype.remove_from_room = function() {

    if (this.room === null) {
        server.log("Tried to take item " + this.name + " from room, but item does not have room.", 0);
        return false;
    }

    server.send.remove_items_room([this], this.room);

    this.room = null;
}


/**
 * Give this item to an agent and send updates.
 * @param {Object} agent - agent object to give item to.
 */
Item.prototype.give_to_agent = function(agent) {
    this.agent = agent;

    server.send.add_items_inventory(agent, [this]);
}


/**
 * Take this item from an agent and send updates.
 */
Item.prototype.take_from_agent = function() {

    if (this.agent === null) {
        server.log("Tried to take item " + this.name + " from agent, but item does not have agent.", 0);
        return false;
    }

    server.send.remove_items_inventory(this.agent, [this]);

    this.agent = null;
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

module.exports = Item;
