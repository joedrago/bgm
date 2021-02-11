DRAG_THRESHOLD_PIXELS = 16

class BGMGameScene extends Phaser.Scene
  constructor: ->
    super()
    Phaser.Scene.call(this, { key: 'game', active: true });

    @dragAccumulator = null
    @dragged = false

    @width = 60
    @height = 30

    @grid = new Array(@width)
    for i in [0...@width]
      @grid[i] = new Array(@height)
      for j in [0...@height]
        @grid[i][j] =
          bomb: false
          sprite: null

  preload: ->
    @load.image('blank', 'images/blank.gif')
    @load.image('flag', 'images/bombflagged.gif')

    @load.plugin('rexpinchplugin', 'lib/rexpinchplugin.min.js', true)

  create: ->
    for i in [0...@width]
      for j in [0...@height]
        @grid[i][j].sprite = @add.image(i * 16, j * 16, 'blank')
        @grid[i][j].sprite.setOrigin(0, 0)

    camera = @cameras.main
    pinch = @plugins.get('rexpinchplugin').add(this)

    # This is really the "pinch" threshold
    # pinch.setDragThreshold(50)

    pinch.on 'drag1start', =>
      @dragAccumulator = new Phaser.Math.Vector2(0, 0)
    pinch.on 'drag1end', =>
      if not @dragged
        x = @game.input.activePointer.worldX
        y = @game.input.activePointer.worldY
        @tap(x, y)
      @dragged = false
    pinch.on 'drag1', (pinch) =>
      if @dragAccumulator?
        @dragAccumulator.add(pinch.drag1Vector)
        if @dragAccumulator.length() > DRAG_THRESHOLD_PIXELS
          camera.scrollX -= @dragAccumulator.x / camera.zoom
          camera.scrollY -= @dragAccumulator.y / camera.zoom
          @dragAccumulator = null
          @dragged = true
      else
        camera.scrollX -= pinch.drag1Vector.x / camera.zoom
        camera.scrollY -= pinch.drag1Vector.y / camera.zoom
        @dragged = true
    pinch.on 'pinch', (pinch) =>
      scaleFactor = pinch.scaleFactor
      camera.zoom *= scaleFactor
      @dragAccumulator = null
      @dragged = true

  tap: (worldX, worldY) ->
    hud = this.scene.get('hud')
    hud.debugText.text = "Tapped: #{worldX.toFixed(1)} #{worldY.toFixed(1)}"

    if (worldX >= 0) and (worldX < (@width * 16)) and (worldY >= 0) and (worldY < (@height * 16))
      x = Math.floor(worldX / 16)
      y = Math.floor(worldY / 16)
      @grid[x][y].bomb = !@grid[x][y].bomb
      if @grid[x][y].bomb
        @grid[x][y].sprite.setTexture('flag')
      else
        @grid[x][y].sprite.setTexture('blank')


  update: ->

class BGMHudScene extends Phaser.Scene
  constructor: ->
    super()
    Phaser.Scene.call(this, { key: 'hud', active: true });

  preload: ->

  create: ->
    @debugText = @add.text(0, 0, 'Tap somewhere!')

init = ->
  console.log "Bad Guy Minesweeper: init()"

  config =
    type: Phaser.AUTO
    width: document.documentElement.clientWidth
    height: document.documentElement.clientHeight
    backgroundColor: '#2d2d2d'
    parent: 'screen'
    scene: [
      BGMGameScene
      BGMHudScene
    ]

  game = new Phaser.Game(config)


window.addEventListener('load', (e) ->
    init()
, false)
