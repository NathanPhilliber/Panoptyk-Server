var graphics;

$(window).load(function() {
	game = new Phaser.Game({
		width: 800,
		height: 600,
		parent: 'i_div_game',
		title: 'Panoptyk',
		scene: {preload: preload, create: create, update:update},
		backgroundColor: '#00383d'
	});
});

function preload() {
  console.log("Game Load State");

  this.load.image('agent', 'public/game/assets/agent_sprite.png');
  this.load.image('agent_other', 'public/game/assets/agent_other_sprite.png');
  this.load.image('item', 'public/game/assets/item_sprite.png');
  this.load.image('exit', 'public/game/assets/exit_sprite.png');
  this.load.image('conversation', 'public/game/assets/conversation.png');
}

function create() {
  console.log("Game Create State");
  graphics = this;
}

function update() {

}
