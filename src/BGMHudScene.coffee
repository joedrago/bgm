class BGMHudScene extends Phaser.Scene
  constructor: ->
    super()
    Phaser.Scene.call(this, { key: 'hud', active: true });

  preload: ->
    @load.image('glass', 'images/glass.gif')

    @load.image('btn_bomb', 'images/btn_bomb.png')
    @load.image('btn_flag', 'images/btn_flag.png')

  create: ->
    @panelX = Math.floor(@cameras.main.width * 0.9)
    @panelY = 0
    @panelW = @cameras.main.width - @panelX
    @panelH = @cameras.main.height

    @panelBackground = @add.graphics()
    @panelBackground.fillStyle(0x333333, 1)
    @panelBackground.fillRect(@panelX, @panelY, @panelW, @panelH)
    @panelBackground.lineStyle(1, 0x000000, 1.0)
    @panelBackground.strokeRect(@panelX, @panelY, @panelW, @panelH)

    @button = @add.image(@panelX + (@panelW / 2), @panelY + (@panelH / 2), 'btn_bomb')
    @button.setDisplaySize(@panelW * 0.8, @panelW * 0.8)
    @button.setInteractive()
    @button.on 'pointerdown', =>
      @toggleMode()
    @toggleMode()

    @debugText = @add.text(0, 0, '')
    @glass = @add.image(50, 50, 'glass')
    @glass.setOrigin(0.6, 0.3) # roughly the middle of the magnifying glass
    @glass.alpha = 0

  toggleMode: ->
    if @mode == 'bomb'
      @mode = 'flag'
    else
      @mode = 'bomb'

    @button.setTexture("btn_#{@mode}")
    @scene.get('game').setMode(@mode)

  update: ->

  setMagnifyingGlass: (x, y, alpha) ->
    @glass.x = x
    @glass.y = y
    @glass.alpha = alpha


module.exports = BGMHudScene
