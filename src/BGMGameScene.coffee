TouchInterpreter = require './TouchInterpreter'

class BGMGameScene extends Phaser.Scene
  constructor: ->
    super()
    Phaser.Scene.call(this, { key: 'game', active: true });

    @ms = require './MineSweeper'
    @touch = new TouchInterpreter

  preload: ->
    @load.image('blank', 'images/blank.gif')
    @load.image('flag', 'images/bombflagged.gif')
    @load.image('bomb', 'images/bomb0.gif')
    @load.image('bombdeath', 'images/bombdeath.gif')
    @load.image('bombrevealed', 'images/bombrevealed.gif')
    @load.image('bombmisflagged', 'images/bombmisflagged.gif')

    @load.image('shadow0', 'images/shadow0.gif')
    @load.image('shadow1', 'images/shadow1.gif')
    @load.image('shadow2', 'images/shadow2.gif')
    @load.image('shadow3', 'images/shadow3.gif')
    @load.image('shadow4', 'images/shadow4.gif')
    @load.image('shadow5', 'images/shadow5.gif')
    @load.image('shadow6', 'images/shadow6.gif')
    @load.image('shadow7', 'images/shadow7.gif')
    @load.image('shadow8', 'images/shadow8.gif')

    @load.image('bomb0', 'images/bomb0.gif')
    @load.image('bomb1', 'images/bomb1.gif')
    @load.image('bomb2', 'images/bomb2.gif')
    @load.image('bomb3', 'images/bomb3.gif')
    @load.image('bomb4', 'images/bomb4.gif')
    @load.image('bomb5', 'images/bomb5.gif')
    @load.image('bomb6', 'images/bomb6.gif')
    @load.image('bomb7', 'images/bomb7.gif')
    @load.image('bomb8', 'images/bomb8.gif')

    @load.image('open0', 'images/open0.gif')
    @load.image('open1', 'images/open1.gif')
    @load.image('open2', 'images/open2.gif')
    @load.image('open3', 'images/open3.gif')
    @load.image('open4', 'images/open4.gif')
    @load.image('open5', 'images/open5.gif')
    @load.image('open6', 'images/open6.gif')
    @load.image('open7', 'images/open7.gif')
    @load.image('open8', 'images/open8.gif')

  create: ->
    split = Math.floor(@cameras.main.width * 0.9)
    @cameras.main.setViewport(0, 0, split, @cameras.main.height)

    @ms.addEventListener (ev, args) =>
      switch ev
        when 'new'
          if (@ms.width != @gridCols) or (@ms.height != @gridRows)
            @recreateDisplayList()
        when 'cell'
          @grid[args[0]][args[1]].setTexture(args[2])
        when 'life'
          @scene.get('hud').debugText.text = "Are you suuuuuuure? (#{args[0]})"
    @recreateDisplayList()
    @ms.updateAll()

    @touch.create(this, @cameras.main, 0, 0, split, @cameras.main.height)

  update: ->

  recreateDisplayList: ->
    console.log "recreateDisplayList()"
    @add.displayList.removeAll()

    @gridCols = @ms.width
    @gridRows = @ms.height
    @grid = new Array(@gridCols)
    for i in [0...@gridCols]
      @grid[i] = new Array(@gridRows)
      for j in [0...@gridRows]
        @grid[i][j] = @add.image(i * 16, j * 16, 'blank')
        @grid[i][j].setOrigin(0, 0)
    @resetView()

  centerGrid: ->
    totalW = @gridCols * 16
    totalH = @gridRows * 16
    @cameras.main.scrollX = (totalW - @cameras.main.width) / 2
    @cameras.main.scrollY = (totalH - @cameras.main.height) / 2

  resetView: ->
    @cameras.main.zoom = 1
    @centerGrid()

  setMode: (@mode) ->
    # console.log "Game Mode: #{@mode}"
    if @ms.gameover
      @ms.newGame()

  setMagnifyingGlass: (x, y, alpha) ->
    @scene.get('hud').setMagnifyingGlass(x, y, alpha)

  rmb: (worldX, worldY) ->
    @scene.get('hud').toggleMode()

  tap: (worldX, worldY) ->
    @scene.get('hud').debugText.text = ""

    if @ms.gameover
      console.log "game is over, doing nothing"
      return

    if (worldX >= 0) and (worldX < (@gridCols * 16)) and (worldY >= 0) and (worldY < (@gridRows * 16))
      x = Math.floor(worldX / 16)
      y = Math.floor(worldY / 16)
      if @mode == 'flag'
        @ms.flag(x, y)
      else
        @ms.poke(x, y)
      @ms.updateAll()

module.exports = BGMGameScene
