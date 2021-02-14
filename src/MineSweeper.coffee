propsToSave = [
  'seed'
  'width'
  'height'
  'bomb'
  'visible'
  'lives'
  'mineCount'
  'gameover'
]

class MineSweeper
  constructor: ->
    @listeners = []
    @width = 0
    @height = 0
    @mineCount = 0
    if not @load()
      @newGame()

  load: ->
    rawData = localStorage.getItem("save")
    if not rawData?
      return false
    try
      data = JSON.parse(rawData)
    catch
      data = null

    if not data?
      return false

    for p in propsToSave
      if not data.hasOwnProperty(p)
        return false

    for p in propsToSave
      this[p] = data[p]
    return true

  save: ->
    data = {}
    for p in propsToSave
      data[p] = this[p]
    localStorage.setItem("save", JSON.stringify(data))

  addEventListener: (evl) ->
    @listeners.push(evl)

  rand: (x) ->
    return Math.floor(Math.bgmrandom() * x)

  neighbors: (i, j, unflaggedOnly) ->
    n = 0
    x1 = Math.max(i - 1, 0)
    x2 = Math.min(@width - 1, i + 1)
    y1 = Math.max(j - 1, 0)
    y2 = Math.min(@height - 1, j + 1)
    x = x1
    while x <= x2
      y = y1
      while y <= y2
        if x != i or y != j
          if !unflaggedOnly or (@visible[x + y * @width] == 0)
            if @bomb[x + y * @width] == 1
              ++n
        ++y
      ++x
    return n

  hasVisibleZeroNeighbor: (i, j) ->
    x1 = Math.max(i - 1, 0)
    x2 = Math.min(@width - 1, i + 1)
    y1 = Math.max(j - 1, 0)
    y2 = Math.min(@height - 1, j + 1)
    x = x1
    while x <= x2
      y = y1
      while y <= y2
        if x != i or y != j
          if @visible[x + y * @width] != 0
            n = @neighbors(x, y, false)
            if n == 0
              return true
        ++y
      ++x
    return false

  loseLife: ->
    @lives -= 1
    if @lives > 0
      for evl in @listeners
        evl('life', [@lives])
      return false
    return true

  updateCell: (i, j, reveal) ->
    image = 'blank'
    index = i + j * @width
    isBomb = @bomb[index]
    isVisible = @visible[index]
    n = @neighbors(i, j, false)
    if isVisible == 0
      if reveal
        if isBomb == 1
          image = 'bombrevealed'
        else
          image = 'shadow' + n
      else
        image = 'blank'
    else
      if isBomb == 1
        if isVisible == 2
          image = 'bombdeath'
        else
          unflagged = @neighbors(i, j, true)
          if unflagged == 0
            n = 0
          image = 'bomb' + n
      else
        if isVisible == 2
          image = 'bombmisflagged'
        else
          image = 'open' + n
    for evl in @listeners
      evl('cell', [i, j, image])
    return

  updateAll: (reveal = false) ->
    if @listeners.length == 0
      return

    keepGoing = true
    while keepGoing
      keepGoing = false
      for j in [0...@height]
        for i in [0...@width]
          if (@bomb[i + j * @width] == 0) and @hasVisibleZeroNeighbor(i, j)
            if @poke(i, j)
              keepGoing = true

    won = true
    if @gameover
      won = false

    visibleMines = 0

    for j in [0...@height]
      for i in [0...@width]
        index = i + j * @width
        if @visible[index] == 0
          won = false
        else if @bomb[index] == 1
          visibleMines += 1
        @updateCell(i, j, reveal)
    if won
      @gameover = true
      for evl in @listeners
        evl('win', [])
    for evl in @listeners
      evl('mines', [visibleMines, @mineCount])
      evl('lives', [@lives])
    return

  flag: (i, j) ->
    index = i + j * @width
    if @visible[index] == 0
      if @bomb[index] == 1
        #bomb[index] = 0;
        #poke(i, j);
        @visible[index] = 1
      else
        # Bad flag; lose the game
        if @loseLife()
          @visible[index] = 2
          @gameover = true
          @updateAll(true)
          for evl in @listeners
            evl('lose', [])
          return
    return

  poke: (i, j) ->
    ret = false
    index = i + j * @width
    if @visible[index] == 0
      if @bomb[index] == 1
        # Bad spot; lose the game
        if @loseLife()
          @visible[index] = 2
          @gameover = true
          @updateAll(true)
          for evl in @listeners
            evl('lose', [])
          return false
        else
          return false
      @visible[index] = 1
      ret = true
    return ret

  firstClickIsFree: ->
    cellCount = @width * @height
    startIndex = @rand(cellCount)
    index = startIndex
    loop
      i = Math.floor(index % @width)
      j =
        Math.floor(index / @width)
      n = @neighbors(i, j, false)
      if @bomb[index] == 0 and n == 0
        @poke(i, j)
        return
      index = (index + 1) % cellCount
      if index == startIndex
        break
    loop
      i = Math.floor(index % @width)
      j = Math.floor(index / @width)
      n = neighbors(i, j, false)
      if @bomb[index] == 0
        @poke(i, j)
        return
      index = (index + 1) % cellCount
      if index == startIndex
        break
    return

  newGame: (width = 0, height = 0, mineCount = 0, @seed = String(Math.floor(Math.random() * 1000000))) ->
    Math.seedbgmrandom(@seed)

    if @width == 0
      @width = 8
    if @height == 0
      @height = 8

    # By default, let newGame() re-play whatever the last setting was
    if width != 0
      @width = width
    if height != 0
      @height = height
    if mineCount != 0
      @mineCount = mineCount

    @lives = 3

    cellCount = @width * @height
    if @mineCount == 0
      MINE_DENSITY = 0.16
      @mineCount = Math.floor(cellCount * MINE_DENSITY)

    @gameover = false

    # Create fresh arrays
    @bomb = new Array(cellCount).fill(0)
    @visible = new Array(cellCount).fill(0)

    # Drop in the mines randomly
    indices = new Array(cellCount)
    indices[0] = 0
    i = 1
    while i < cellCount
      j = @rand(i)
      indices[i] = indices[j]
      indices[j] = i
      ++i
    m = @mineCount
    if m >= cellCount
      m = cellCount - 1
    i = 0
    while i < m
      @bomb[indices[i]] = 1
      ++i
    @firstClickIsFree()
    for evl in @listeners
      evl('new', [])
    @updateAll()
    @save()
    return

module.exports = new MineSweeper # Singleton
