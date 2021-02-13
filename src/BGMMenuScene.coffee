class BGMMenuScene extends Phaser.Scene
  constructor: ->
    super {
      key: 'menu'
      active: false
    }

    @ms = require './MineSweeper'

  preload: ->
    @load.image('menu_thing', 'images/btn_menu.png')

  create: ->
    @w = @cameras.main.width
    @h = @cameras.main.height

    @fonts =
      title:
        fontFamily: 'Eagle Lake'
        fontSize: "#{Math.floor(@h / 8)}px"
        color: '#fff'
      button:
        fontFamily: 'Eagle Lake'
        fontSize: "#{Math.floor(@h / 12)}px"
        color: '#fff'

    @panelBackground = @add.graphics()
    @panelBackground.fillStyle(0x330033, 1)
    @panelBackground.fillRect(0, 0, @w, @h)
    @panelBackground.setInteractive(new Phaser.Geom.Rectangle(0, 0, @w, @h), Phaser.Geom.Rectangle.Contains);

    @title = @add.text(@w / 2, @h / 20, 'Bad Guy Minesweeper', @fonts.title)
    @title.setOrigin(0.5, 0.0)

    @nextButtonIndex = 0
    @addButton "Beginner", =>
      @newGame(8, 8, 10)
    @addButton "Intermediate", =>
      @newGame(16, 16, 40)
    @addButton "Expert", =>
      @newGame(30, 16, 99)
    @addButton "Huge", =>
      @newGame(50, 30, 0)

    @nextButtonIndex += 1
    @addButton "Resume", =>
      @scene.sleep('menu')

  addButton: (text, cb) ->
    buttonIndex = @nextButtonIndex
    @nextButtonIndex += 1

    buttonW = Math.floor(@w / 2)
    buttonH = Math.floor(@h / 10)
    buttonMargin = Math.floor(buttonH / 4)
    buttonX = (@w / 2)
    buttonY = (@h / 3.5) + (buttonIndex * (buttonH + buttonMargin))
    centerOffsetX = (buttonW / 2)
    centerOffsetY = (buttonH / 2)

    button = @add.graphics()
    button.fillStyle(0x330033, 1)
    button.fillRect(buttonX - centerOffsetX, buttonY - centerOffsetY, buttonW, buttonH)
    button.setInteractive(new Phaser.Geom.Rectangle(buttonX - centerOffsetX, buttonY - centerOffsetY, buttonW, buttonH), Phaser.Geom.Rectangle.Contains);
    text = @add.text(buttonX, buttonY, text, @fonts.button)
    text.setOrigin(0.5)
    button.on 'pointerdown', ->
      cb()

  newGame: (w, h, m) ->
    @ms.newGame(w, h, m)
    @scene.sleep('menu')

  update: ->

module.exports = BGMMenuScene
