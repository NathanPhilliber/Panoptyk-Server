function Item(name, type) {
    this.item_id = null;
    this.type = type;
    this.name = name;
    this.room = null;
    this.agent = null;
}

Item.prototype.put_in_room = function(room) {
    this.room = room;

    server.send.add_items_room([this], room);
}

Item.prototype.remove_from_room = function() {

    if (this.room === null) {
        server.log("Tried to take item " + this.name + " from room, but item does not have room.", 0);
        return false;
    }

    server.send.remove_items_room([this], this.room);

    this.room = null;
}

Item.prototype.give_to_agent = function(agent) {
    this.agent = agent;

    server.send.add_items_inventory(agent, [this]);
}

Item.prototype.take_from_agent = function() {

    if (this.agent === null) {
        server.log("Tried to take item " + this.name + " from agent, but item does not have agent.", 0);
        return false;
    }

    server.send.remove_items_inventory(this.agent, [this]);

    this.agent = null;
}

Item.prototype.get_data = function() {
    return {
        'item_id': this.item_id,
        'item_type': this.type,
        'item_name': this.name
    }
}

module.exports = Item;
