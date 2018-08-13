
function Item(id, name, type) {
  this.item_id = id;
  this.name = name;
  this.type = type;
  this.x = Math.random() * (game.canvas.width-150) + 75;
  this.y = Math.random() * (game.canvas.height-150) + 75;
  this.graphics = graphics.add.graphics(0,0);
  this.draw();

  console.log("Item " + name + " initialized");
}

Item.prototype.draw = function() {
  this.graphics.fillStyle(0x0022FF, 1);
  this.graphics.fillCircle(this.x, this.y, 10, 10, 25);
  var title = graphics.add.text(this.x, this.y-5, this.name, {fill:'#fff', font:'16px Arial' });
  title.setOrigin(0,1);
}
