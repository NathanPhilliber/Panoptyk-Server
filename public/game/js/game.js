var graphics;

game = new Phaser.Game({
  width: 800,
  height: 600,
  parent: 'i_div_game',
  title: 'Panoptyk',
  scene: {preload: preload, create: create, update:update},
  backgroundColor: '#00383d'
});


function preload() {
  console.log("Game Load State");
}

function create() {
  console.log("Game Create State");
  graphics = this;
}

function update() {

}
