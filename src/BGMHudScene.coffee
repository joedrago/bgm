class BGMHudScene extends Phaser.Scene
  constructor: ->
    super {
      key: 'hud'
      active: true
    }

    @ms = require './MineSweeper'

  preload: ->
    @load.image('glass', 'images/glass.gif')
    @load.image('lives', 'images/lives.png')
    @load.image('mines', 'images/mines.png')

    @load.image('btn_bomb', 'images/btn_bomb.png')
    @load.image('btn_flag', 'images/btn_flag.png')
    @load.image('btn_menu', 'images/btn_menu.png')

  create: ->
    @w = @cameras.main.width
    @h = @cameras.main.height
    @fonts =
      mines:
        fontFamily: 'Eagle Lake'
        fontSize: "#{Math.floor(@h / 30)}px"
        color: '#fff'
      lives:
        fontFamily: 'Eagle Lake'
        fontSize: "#{Math.floor(@h / 16)}px"
        color: '#fff'
      life:
        fontFamily: 'Colored Crayons'
        fontSize: "#{Math.floor(@h / 5)}px"
        color: '#ff3'
      lose:
        fontFamily: 'Colored Crayons'
        fontSize: "#{Math.floor(@h / 5)}px"
        color: '#f33'
      win:
        fontFamily: 'Colored Crayons'
        fontSize: "#{Math.floor(@h / 5)}px"
        color: '#3f3'

    @panelW = Math.floor(@cameras.main.height * 0.17)
    @panelH = @cameras.main.height
    @panelX = @cameras.main.width - @panelW
    @panelY = 0

    @panelBackground = @add.graphics()
    @panelBackground.fillStyle(0x333333, 1)
    @panelBackground.fillRect(@panelX, @panelY, @panelW, @panelH)
    @panelBackground.lineStyle(1, 0x000000, 1.0)
    @panelBackground.strokeRect(@panelX, @panelY, @panelW, @panelH)

    @buttons = {}

    @buttons.mode = @add.image(@panelX + (@panelW / 2), @panelY + (@panelH / 2), 'btn_bomb')
    @buttons.mode.setDisplaySize(@panelW * 0.8, @panelW * 0.8)
    @buttons.mode.setInteractive()
    @buttons.mode.on 'pointerdown', =>
      @toggleMode()
    @toggleMode()

    @buttons.menu = @add.image(@panelX + (@panelW / 2), @panelY + (@panelW * 0.5), 'btn_menu')
    @buttons.menu.setDisplaySize(@panelW * 0.8, @panelW * 0.8)
    @buttons.menu.setInteractive()
    @buttons.menu.on 'pointerdown', =>
      @scene.launch('menu')

    @minesBackground = @add.image(@panelX + (@panelW / 2), @panelY + (@panelH * 0.7), 'mines')
    @minesBackground.setDisplaySize(@panelW, @panelW)
    @mines = @add.text(@panelX + (@panelW / 2), @panelY + (@panelH * 0.73), 'mines', @fonts.mines)
    @mines.setOrigin(0.5)

    @livesBackground = @add.image(@panelX + (@panelW / 2), @panelY + (@panelH * 0.9), 'lives')
    @livesBackground.setDisplaySize(@panelW * 0.8, @panelW * 0.8)
    @lives = @add.text(@panelX + (@panelW / 2), @panelY + (@panelH * 0.9), 'lives', @fonts.lives)
    @lives.setOrigin(0.5)

    @glass = @add.image(50, 50, 'glass')
    @glass.setOrigin(0.6, 0.3) # roughly the middle of the magnifying glass
    @glass.alpha = 0

    @lifeText = @add.text(@w / 2, @h / 2, 'Are you sure?', @fonts.life)
    @lifeText.setOrigin(0.5)
    @lifeText.setShadow(8, 8)
    @lifeText.alpha = 0
    @lifeTween = @tweens.add {
      targets: @lifeText
      alpha:
        value: 1
        duration: 400
      hold: 1000
      yoyo: true
      loop: 0
      paused: true
    }

    @winText = @add.text(@w / 2, @h / 2, 'You win!', @fonts.win)
    @winText.setOrigin(0.5)
    @winText.setShadow(8, 8)
    @winText.alpha = 0
    @winTween = @tweens.add {
      targets: @winText
      alpha:
        value: 1
        duration: 400
      yoyo: false
      loop: 0
      paused: true
    }

    @loseText = @add.text(@w / 2, @h / 2, 'You lose!', @fonts.lose)
    @loseText.setOrigin(0.5)
    @loseText.setShadow(8, 8)
    @loseText.alpha = 0
    @loseTween = @tweens.add {
      targets: @loseText
      alpha:
        value: 1
        duration: 400
      yoyo: false
      loop: 0
      paused: true
    }

    @ms.addEventListener(@msEvent.bind(this))
    @ms.updateAll()

  msEvent: (ev, args) ->
    if ev != 'cell'
      console.log "HUD msEvent: #{ev}: #{JSON.stringify(args)}"
    switch ev
      when 'new'
        @winText.alpha = 0
        @loseText.alpha = 0
      when 'life'
        @lifeTween.resume()
        @lifeTween.restart()
      when 'win'
        @winText.alpha = 0
        @winTween.resume()
        @winTween.restart()
      when 'lose'
        @loseTween.resume()
        @loseTween.restart()

  toggleMode: ->
    if @ms.gameover
      @ms.newGame()
    else if @mode == 'bomb'
      @mode = 'flag'
    else
      @mode = 'bomb'

    @buttons.mode.setTexture("btn_#{@mode}")
    @scene.get('game').setMode(@mode)

  update: ->

  setMagnifyingGlass: (x, y, alpha) ->
    @glass.x = x
    @glass.y = y
    @glass.alpha = alpha


module.exports = BGMHudScene
