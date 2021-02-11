class BGMHudScene extends Phaser.Scene
  constructor: ->
    super()
    Phaser.Scene.call(this, { key: 'hud', active: true });

  preload: ->
    @load.image('glass', 'images/glass.gif')

  create: ->
    @debugText = @add.text(0, 0, 'Tap somewhere!')
    @glass = @add.image(50, 50, 'glass')
    @glass.setOrigin(0.6, 0.3) # roughly the middle of the magnifying glass
    @glass.alpha = 0

  update: ->

  setMagnifyingGlass: (x, y, alpha) ->
    @glass.x = x
    @glass.y = y
    @glass.alpha = alpha


module.exports = BGMHudScene
