TouchInterpreter = require './TouchInterpreter'

class BGMGameScene extends Phaser.Scene
  constructor: ->
    super()
    Phaser.Scene.call(this, { key: 'game', active: true });

    @width = 60
    @height = 30

    @grid = new Array(@width)
    for i in [0...@width]
      @grid[i] = new Array(@height)
      for j in [0...@height]
        @grid[i][j] =
          sprite: null

    @touch = new TouchInterpreter

  preload: ->
    @load.image('blank', 'images/blank.gif')
    @load.image('flag', 'images/bombflagged.gif')
    @load.image('bomb', 'images/bomb0.gif')

  create: ->
    split = Math.floor(@cameras.main.width * 0.9)
    @cameras.main.setViewport(0, 0, split, @cameras.main.height)

    for i in [0...@width]
      for j in [0...@height]
        @grid[i][j].sprite = @add.image(i * 16, j * 16, 'blank')
        @grid[i][j].sprite.setOrigin(0, 0)

        @grid[0][0].sprite.setTexture('flag')

    @touch.create(this, @cameras.main, 0, 0, split, @cameras.main.height)

  update: ->

  setMode: (@mode) ->
    # console.log "Game Mode: #{@mode}"

  setMagnifyingGlass: (x, y, alpha) ->
    @scene.get('hud').setMagnifyingGlass(x, y, alpha)

  tap: (worldX, worldY) ->
    # @scene.get('hud').debugText.text = "Tapped: #{worldX.toFixed(1)} #{worldY.toFixed(1)}"

    if (worldX >= 0) and (worldX < (@width * 16)) and (worldY >= 0) and (worldY < (@height * 16))
      x = Math.floor(worldX / 16)
      y = Math.floor(worldY / 16)
      @grid[x][y].bomb = !@grid[x][y].bomb
      if @mode == 'flag'
        @grid[x][y].sprite.setTexture('flag')
      else
        @grid[x][y].sprite.setTexture('bomb')

module.exports = BGMGameScene
