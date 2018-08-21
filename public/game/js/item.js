
function Item(id, name, type, x=null, y=null) {
  this.item_id = id;
  this.name = name;
  this.type = type;
  this.x = x == null ? Math.random() * (game.canvas.width-150) + 75 : x;
  this.y = y == null ? Math.random() * (game.canvas.height-150) + 75 : y;
  this.graphics = graphics.add.graphics(0,0);
  this.sprite = graphics.add.sprite(this.x, this.y, 'item');
  this.sprite.setOrigin(0.5, 0);
  this.sprite.setInteractive();

  var this_item = this;

  this.sprite.on('pointerdown', function(ev) {
    console.log("Request pickup item " + this_item.item_id);
    Client.send.takeItems([this_item]);
  });
  this.draw();

  console.log("Item " + this.item_id + ":" + this.name + " initialized");
}

Item.prototype.draw = function() {
  this.title = graphics.add.text(this.x, this.y-5, this.name, {fill:'#fff', font:'16px Arial' });
  this.title.setOrigin(0.5,1);
}

Item.prototype.destroy = function() {
  this.sprite.destroy();
  this.title.destroy();
}
