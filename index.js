
// core engine
var noa = require('noa-engine')

// local modules
var slides = require('./lib/slides')
var createUI = require('./lib/ui')
var worldgen = require('./lib/worldgen')
var createInputs = require('./lib/inputs')
var makeParticles = require('./lib/particles')
var createHover = require('./lib/hover')

// engine options
var opts = {
  // inputs
  pointerLock: true,
  inverseY: true,
  blockTestDistance: 20,
  // world data
  chunkSize: 24,
  generator: worldgen.generator, // pass in a more interesting generator function
  texturePath: 'textures/',
  chunkAddDistance: 2,
  chunkRemoveDistance: 4,
  // player
  playerStart: [1.5,15,1.5],
  playerHeight: 1.4,
  playerWidth: 1.0  ,
  playerAutoStep: true,
  // rendering
  AOmultipliers: [1.0, 0.75, 0.5],
  useAO: true,
  chunkSize: 32,
}


// create engine instance
var game = noa( opts )

// register stuff needed for worldgen
worldgen.registerBlocks(game)
worldgen.initSpecials(game, slides.slideData)


// events to show/hide slides on mouseover
game.on('tick', function() {
  var slide = null
  var loc = game.getTargetBlock()
  if (loc) {
    var props = game.world.getBlockProperties(loc[0], loc[1], loc[2])
    if (props && props.slide) {
      slide = props.slide
    }
  }
  if (slide) slides.showSlide(slide)
  else slides.hideSlide()
})






// particle-adding local module
var particleAdder = makeParticles(game)


// local module to set up inputs
createInputs(game, particleAdder)

// hover-pack module
createHover(game, particleAdder)




/*
 *    basic player mesh
*/

// register a spritesheet which has player/mob sprites
game.registry.registerMaterial('playersprite', null, 'player.png')


var ph = opts.playerHeight,
    pw = opts.playerWidth

var pmesh = game.rendering.makeEntitySpriteMesh('playersprite', 30, 30, 0)
pmesh.scaling = new BABYLON.Vector3(pw, ph, 1)
game.setPlayerMesh(pmesh, [pw/2, ph/2, pw/2] )

// simplest animation evar
var facing = 1
game.playerEntity.on('tick',function() {
  var onground = this.body.resting[1] < 0
  var cell = (onground) ? 0 : 1
  this.mesh._setCell(cell)
  if (game.inputs.state.left) facing = -1
  if (game.inputs.state.right) facing = 1
  game.playerEntity.mesh.scaling.x = pw * facing
})




/*
 *    Goofing around with 3D Conway/Life
*/

var conway = require('./lib/conway')(game)
game.inputs.bind('conway', '3')
game.inputs.down.on('conway', function() {
  conway.fire()
})
game.inputs.bind('conway-ss', '4')
game.inputs.down.on('conway-ss', function() {
  conway.startStop()
})




