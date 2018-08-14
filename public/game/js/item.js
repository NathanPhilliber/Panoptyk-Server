
function Item(id, name, type) {
  this.item_id = id;
  this.name = name;
  this.type = type;
  this.x = Math.random() * (game.canvas.width-150) + 75;
  this.y = Math.random() * (game.canvas.height-150) + 75;
  this.graphics = graphics.add.graphics(0,0);
  this.sprite = graphics.add.sprite(this.x, this.y, 'item');
  this.sprite.setOrigin(0.5, 0);
  this.draw();

  console.log("Item " + name + " initialized");
}

Item.prototype.draw = function() {
  this.title = graphics.add.text(this.x, this.y-5, this.name, {fill:'#fff', font:'16px Arial' });
  this.title.setOrigin(0.5,1);
}

Item.prototype.destroy = function() {
  this.sprite.destroy();
  this.title.destroy();
}
