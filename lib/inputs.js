'use strict';

/*
 *  Set up keybinds and whatnot
*/


module.exports = function(game, particleAdder) {

  // on left mouse, set targeted block to be air
  game.inputs.down.on('fire', function() {
    // skip click if just gaining pointer lock
    var cont = game.container
    if (!cont.hasPointerLock() && cont.supportsPointerLock()) return

    var loc = game.getTargetBlock()
    if (loc) {
      var props = game.world.getBlockProperties(loc[0], loc[1], loc[2])
      if (props && props.slide) {
        if (props.onclick) props.onclick()
          } else {
            game.setBlock(0, loc)
            // smoke for removed block
            particleAdder(1, loc, [0.5, 0.5, 0.5], 1, 80, .4, .2, true);
          }
    }
  })



  // on middle mouse, remember type of targeted block
  var placeBlockID = 2
  game.inputs.down.on('mid-fire', function() {
    var loc = game.getTargetBlock()
    if (loc) {
      var props = game.world.getBlockProperties(loc[0], loc[1], loc[2])
      if (props && props.slide) return
      placeBlockID = game.getBlock(loc);
    }
  })

  // on right mouse, place remembered block adjacent to target
  game.inputs.down.on('alt-fire', function() {
    var loc = game.getTargetBlockAdjacent()
    if (loc) game.addBlock(placeBlockID, loc); // addBlock works only if spot is clear
  })

  // bind "i" key to invert mouse
  game.inputs.bind('invertY', 'I')
  game.inputs.down.on('invertY', function() {
    game.controls.inverseY = !game.controls.inverseY
  })


  // add listener to slide container to grab pointerlock on click
  var slides = document.getElementById('slideBox')
  slides.addEventListener('mousedown', function(e) {
    game.container._element.requestPointerLock()
  })
  
  
}








