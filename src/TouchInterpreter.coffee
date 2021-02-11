ENGAGE_DRAG_DISTANCE = 10
DOUBLE_CLICK_MS = 400

class TouchInterpreter
  constructor: ->
    @tracked = []
    @dragX = 0
    @dragY = 0
    @dragging = false
    @doubleClickTime = null
    @pinchAnchor = null
    @pinchAnchorWorld = null

  create: (@scene, @camera) ->

    @camera.zoom = 1

    @scene.input.addPointer(1)

    @scene.input.on 'pointerdown', (pointer) =>
      if @tracked.length == 0
        @dragging = false

      # console.log "new pointer #{pointer.id}"
      @tracked.push {
        id: pointer.id
        pos: pointer.position.clone()
      }
      if @tracked.length == 1
        @setDragPoint()
      if @tracked.length == 2
        # We just added a second touch spot. Calculate the anchor for pinching now
        @calcPinchAnchor()

      if @tracked.length > 1
        @dragging = true
        @doubleClickTime = null
      else if not @dragging
        now = new Date().getTime()
        if @doubleClickTime != null
          # second click
          clickDelta = now - @doubleClickTime
          if clickDelta < DOUBLE_CLICK_MS
            @doubleClickTime = null
            # console.log "DOUBLE TAP #{@tracked[0].pos.x} #{@tracked[0].pos.y}"
            return
        @doubleClickTime = now

    @scene.input.on 'pointermove', (pointer) =>
      prevDistance = 0
      if @tracked.length >= 2
        prevDistance = @calcDistance(@tracked[0].pos.x, @tracked[0].pos.y, @tracked[1].pos.x, @tracked[1].pos.y)
      if @tracked.length == 1
        prevX = @tracked[0].pos.x
        prevY = @tracked[0].pos.y

      index = -1
      for i in [0...@tracked.length]
        if @tracked[i].id == pointer.id
          index = i
          break
      if index != -1
        # console.log "updating touch #{id}, tracking #{@tracked.length} touches"
        @tracked[index].pos = pointer.position.clone()

      if @tracked.length == 1
        # single touch, consider dragging
        dragDistance = @calcDistance @dragX, @dragY, @tracked[0].pos.x, @tracked[0].pos.y
        if @dragging or (dragDistance > ENGAGE_DRAG_DISTANCE)
          @dragging = true
          if dragDistance > 0.5
            dx = @tracked[0].pos.x - @dragX
            dy = @tracked[0].pos.y - @dragY
            # console.log "single drag: #{dx}, #{dy}"
            @camera.scrollX -= dx / @camera.zoom
            @camera.scrollY -= dy / @camera.zoom

            # console.log "scroll #{@camera.scrollX} #{@camera.zoom} #{@camera.width}"
          @setDragPoint()

      else if @tracked.length >= 2
        # at least two fingers present, check for pinch/zoom
        currDistance = @calcDistance(@tracked[0].pos.x, @tracked[0].pos.y, @tracked[1].pos.x, @tracked[1].pos.y)
        deltaDistance = currDistance - prevDistance
        if deltaDistance != 0
          newZoom = @camera.zoom * (1 + (deltaDistance * 4 / @camera.width))
          if newZoom < 0.1
            newZoom = 0.1
          if newZoom > 5
            newZoom = 5
          @camera.zoom = newZoom

          halfW = (@camera.width / 2)
          halfH = (@camera.height / 2)
          offsetX = (@pinchAnchor.x - halfW) / newZoom
          offsetY = (@pinchAnchor.y - halfH) / newZoom
          @camera.scrollX = @pinchAnchorWorld.x - halfW - offsetX
          @camera.scrollY = @pinchAnchorWorld.y - halfH - offsetY
      return

    @scene.input.on 'pointerup', (pointer) =>
      if @tracked.length == 1
        if not @dragging
          worldPos = @camera.getWorldPoint(@tracked[0].pos.x, @tracked[0].pos.y)
          # console.log "TAP #{worldPos.x} #{worldPos.y} #{@camera.scrollX} #{@camera.scrollY} #{@camera.zoom}"
          @scene.tap(worldPos.x, worldPos.y)

      index = -1
      for i in [0...@tracked.length]
        if @tracked[i].id == pointer.id
          index = i
          break
      if index != -1
        @tracked.splice(index, 1)
        if @tracked.length == 1
          @setDragPoint()

        if index < 2
          # We just forgot one of our pinch touches. Pick a new anchor spot.
          @calcPinchAnchor()

      @scene.setMagnifyingGlass(0, 0, 0)
      return

  setDragPoint: ->
    @dragX = @tracked[0].pos.x
    @dragY = @tracked[0].pos.y

  calcPinchAnchor: ->
    if @tracked.length >= 2
      pinchX = Math.floor((@tracked[0].pos.x + @tracked[1].pos.x) / 2)
      pinchY = Math.floor((@tracked[0].pos.y + @tracked[1].pos.y) / 2)
      @pinchAnchor = {x: pinchX, y: pinchY }
      @pinchAnchorWorld = @camera.getWorldPoint(pinchX, pinchY) # { x: pinchX, y: pinchY }
      # console.log "pinchAnchor #{@pinchAnchor.x} #{@pinchAnchor.y}"

      @scene.setMagnifyingGlass(@pinchAnchor.x, @pinchAnchor.y, 1)

  calcDistance: (x1, y1, x2, y2) ->
    dx = x2 - x1
    dy = y2 - y1
    return Math.sqrt(dx*dx + dy*dy)

module.exports = TouchInterpreter
