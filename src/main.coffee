# DRAG_THRESHOLD_PIXELS = 16

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
          bomb: false
          sprite: null

    @touch =
      ENGAGE_DRAG_DISTANCE: 10
      DOUBLE_CLICK_MS: 400
      tracked: []
      dragX: 0
      dragY: 0
      dragging: false
      doubleClickTime: null
      pinchAnchor: null
      pinchAnchorWorld: null


  preload: ->
    @load.image('blank', 'images/blank.gif')
    @load.image('flag', 'images/bombflagged.gif')

  create: ->
    for i in [0...@width]
      for j in [0...@height]
        @grid[i][j].sprite = @add.image(i * 16, j * 16, 'blank')
        @grid[i][j].sprite.setOrigin(0, 0)

        @grid[0][0].sprite.setTexture('flag')

    @input.addPointer(1)

    @input.on 'pointerdown', (pointer) =>
      if @touch.tracked.length == 0
        @touch.dragging = false

      console.log "new pointer #{pointer.id}"
      @touch.tracked.push {
        id: pointer.id
        pos: pointer.position.clone()
      }
      if @touch.tracked.length == 1
        @setDragPoint()
      if @touch.tracked.length == 2
        # We just added a second touch spot. Calculate the anchor for pinching now
        @calcPinchAnchor()

      if @touch.tracked.length > 1
        @touch.dragging = true
        @touch.doubleClickTime = null
      else if not @touch.dragging
        now = new Date().getTime()
        if @touch.doubleClickTime != null
          # second click
          clickDelta = now - @touch.doubleClickTime
          if clickDelta < @touch.DOUBLE_CLICK_MS
            @touch.doubleClickTime = null
            console.log "DOUBLE TAP #{@touch.tracked[0].pos.x} #{@touch.tracked[0].pos.y}"
            return
        @touch.doubleClickTime = now

    @input.on 'pointermove', (pointer) =>
      prevDistance = 0
      if @touch.tracked.length >= 2
        prevDistance = @calcDistance(@touch.tracked[0].pos.x, @touch.tracked[0].pos.y, @touch.tracked[1].pos.x, @touch.tracked[1].pos.y)
      if @touch.tracked.length == 1
        prevX = @touch.tracked[0].pos.x
        prevY = @touch.tracked[0].pos.y

      index = -1
      for i in [0...@touch.tracked.length]
        if @touch.tracked[i].id == pointer.id
          index = i
          break
      if index != -1
        # console.log "updating touch #{id}, tracking #{@touch.tracked.length} touches"
        @touch.tracked[index].pos = pointer.position.clone()

      if @touch.tracked.length == 1
        # single touch, consider dragging
        dragDistance = @calcDistance @touch.dragX, @touch.dragY, @touch.tracked[0].pos.x, @touch.tracked[0].pos.y
        if @touch.dragging or (dragDistance > @touch.ENGAGE_DRAG_DISTANCE)
          @touch.dragging = true
          if dragDistance > 0.5
            dx = @touch.tracked[0].pos.x - @touch.dragX
            dy = @touch.tracked[0].pos.y - @touch.dragY
            # console.log "single drag: #{dx}, #{dy}"
            @cameras.main.scrollX -= dx / @cameras.main.zoom
            @cameras.main.scrollY -= dy / @cameras.main.zoom

            console.log "scroll #{@cameras.main.scrollX} #{@cameras.main.zoom} #{@cameras.main.width}"
          @setDragPoint()

      else if @touch.tracked.length >= 2
        # at least two fingers present, check for pinch/zoom
        currDistance = @calcDistance(@touch.tracked[0].pos.x, @touch.tracked[0].pos.y, @touch.tracked[1].pos.x, @touch.tracked[1].pos.y)
        deltaDistance = currDistance - prevDistance
        if deltaDistance != 0
          newZoom = @cameras.main.zoom * (1 + (deltaDistance * 4 / @cameras.main.width))
          if newZoom < 0.1
            newZoom = 0.1
          if newZoom > 5
            newZoom = 5
          @cameras.main.zoom = newZoom

          halfW = (@cameras.main.width / 2)
          halfH = (@cameras.main.height / 2)
          offsetX = (@touch.pinchAnchor.x - halfW) / newZoom
          offsetY = (@touch.pinchAnchor.y - halfH) / newZoom
          @cameras.main.scrollX = @touch.pinchAnchorWorld.x - halfW - offsetX
          @cameras.main.scrollY = @touch.pinchAnchorWorld.y - halfH - offsetY
      return

    @input.on 'pointerup', (pointer) =>
      if @touch.tracked.length == 1
        if not @touch.dragging
          worldPos = @cameras.main.getWorldPoint(@touch.tracked[0].pos.x, @touch.tracked[0].pos.y)
          console.log "TAP #{worldPos.x} #{worldPos.y} #{@cameras.main.scrollX} #{@cameras.main.scrollY} #{@cameras.main.zoom}"

      index = -1
      for i in [0...@touch.tracked.length]
        if @touch.tracked[i].id == pointer.id
          index = i
          break
      if index != -1
        @touch.tracked.splice(index, 1)
        if @touch.tracked.length == 1
          @setDragPoint()

        if index < 2
          # We just forgot one of our pinch touches. Pick a new anchor spot.
          @calcPinchAnchor()

      hud = this.scene.get('hud')
      hud.glass.alpha = 0
      return

  calcDistance: (x1, y1, x2, y2) ->
    dx = x2 - x1
    dy = y2 - y1
    return Math.sqrt(dx*dx + dy*dy)

  setDragPoint: ->
    @touch.dragX = @touch.tracked[0].pos.x
    @touch.dragY = @touch.tracked[0].pos.y

  calcPinchAnchor: ->
    if @touch.tracked.length >= 2
      pinchX = Math.floor((@touch.tracked[0].pos.x + @touch.tracked[1].pos.x) / 2)
      pinchY = Math.floor((@touch.tracked[0].pos.y + @touch.tracked[1].pos.y) / 2)
      @touch.pinchAnchor = {x: pinchX, y: pinchY }
      @touch.pinchAnchorWorld = @cameras.main.getWorldPoint(pinchX, pinchY) # { x: pinchX, y: pinchY }
      console.log "pinchAnchor #{@touch.pinchAnchor.x} #{@touch.pinchAnchor.y}"

      hud = this.scene.get('hud')
      hud.glass.x = @touch.pinchAnchor.x
      hud.glass.y = @touch.pinchAnchor.y
      hud.glass.alpha = 1

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
    @load.image('glass', 'images/glass.gif')

  create: ->
    @debugText = @add.text(0, 0, 'Tap somewhere!')
    @glass = @add.image(50, 50, 'glass')
    @glass.setOrigin(0.6, 0.3) # roughly the middle of the magnifying glass
    @glass.alpha = 0

init = ->
  console.log "Bad Guy Minesweeper: init()"

  config =
    type: Phaser.AUTO
    width: document.documentElement.clientWidth
    height: document.documentElement.clientHeight
    backgroundColor: '#2d2d2d'
    parent: 'screen'
    input:
      activePointers: 2
    scene: [
      BGMGameScene
      BGMHudScene
    ]

  game = new Phaser.Game(config)


window.addEventListener('load', (e) ->
    init()
, false)
